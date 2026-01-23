import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, IsNull, Not } from 'typeorm';
import { Vehicle } from '../entities/vehicle.entity';
import { CreateVehicleDto, UpdateVehicleDto } from '../dto';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto, userId: number): Promise<Vehicle> {
    // Construct full plate number
    const plate = `${createVehicleDto.plateProvince}${createVehicleDto.plateLetters}${createVehicleDto.plateNumbers}`;

    // Check for duplicate plate
    const existingPlate = await this.vehicleRepository.findOne({
      where: { plate, deletedAt: IsNull() },
    });
    if (existingPlate) {
      throw new ConflictException('Vehicle with this plate already exists');
    }

    // Check for duplicate vehicle number
    const existingVehicleNumber = await this.vehicleRepository.findOne({
      where: { vehicleNumber: createVehicleDto.vehicleNumber, deletedAt: IsNull() },
    });
    if (existingVehicleNumber) {
      throw new ConflictException('Vehicle with this vehicle number already exists');
    }

    const vehicle = this.vehicleRepository.create({
      ...createVehicleDto,
      plate,
      createdBy: userId,
      updatedBy: userId,
    });

    return this.vehicleRepository.save(vehicle);
  }

  async findAll(
    search?: string,
    isActive?: boolean,
    sortBy: string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    page: number = 1,
    limit: number = 10,
  ) {
    const queryBuilder = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.creator', 'creator')
      .where('vehicle.deletedAt IS NULL');

    // Apply search filter
    if (search) {
      queryBuilder.andWhere(
        '(vehicle.plate LIKE :search OR vehicle.vehicleNumber LIKE :search OR vehicle.brand LIKE :search OR vehicle.model LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply active filter
    if (isActive !== undefined) {
      queryBuilder.andWhere('vehicle.isActive = :isActive', { isActive });
    }

    // Apply sorting
    const allowedSortFields = ['plate', 'vehicleNumber', 'brand', 'model', 'createdAt'];
    if (allowedSortFields.includes(sortBy)) {
      queryBuilder.orderBy(`vehicle.${sortBy}`, sortOrder);
    } else {
      queryBuilder.orderBy('vehicle.createdAt', 'DESC');
    }

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['creator', 'updater'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    return vehicle;
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto, userId: number): Promise<Vehicle> {
    const vehicle = await this.findOne(id);

    // If plate parts are being updated, reconstruct full plate
    if (updateVehicleDto.plateProvince || updateVehicleDto.plateLetters || updateVehicleDto.plateNumbers) {
      const plateProvince = updateVehicleDto.plateProvince || vehicle.plateProvince;
      const plateLetters = updateVehicleDto.plateLetters || vehicle.plateLetters;
      const plateNumbers = updateVehicleDto.plateNumbers || vehicle.plateNumbers;
      const newPlate = `${plateProvince}${plateLetters}${plateNumbers}`;

      // Check for duplicate plate if changed
      if (newPlate !== vehicle.plate) {
        const existingPlate = await this.vehicleRepository.findOne({
          where: { plate: newPlate, deletedAt: IsNull() },
        });
        if (existingPlate && existingPlate.id !== id) {
          throw new ConflictException('Vehicle with this plate already exists');
        }
        vehicle.plate = newPlate;
      }
    }

    // Check for duplicate vehicle number if changed
    if (updateVehicleDto.vehicleNumber && updateVehicleDto.vehicleNumber !== vehicle.vehicleNumber) {
      const existingVehicleNumber = await this.vehicleRepository.findOne({
        where: { vehicleNumber: updateVehicleDto.vehicleNumber, deletedAt: IsNull() },
      });
      if (existingVehicleNumber) {
        throw new ConflictException('Vehicle with this vehicle number already exists');
      }
    }

    Object.assign(vehicle, updateVehicleDto);
    vehicle.updatedBy = userId;

    return this.vehicleRepository.save(vehicle);
  }

  async remove(id: number, userId: number): Promise<void> {
    const vehicle = await this.findOne(id);

    vehicle.isActive = false;
    vehicle.deletedAt = new Date();
    vehicle.deletedBy = userId;

    await this.vehicleRepository.save(vehicle);
  }
}
