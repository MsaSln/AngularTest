import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Location } from '../entities/location.entity';
import { CreateLocationDto, UpdateLocationDto } from '../dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto, userId: number): Promise<Location> {
    const location = this.locationRepository.create({
      ...createLocationDto,
      createdBy: userId,
      updatedBy: userId,
    });

    return this.locationRepository.save(location);
  }

  async findAll(
    search?: string,
    isActive?: boolean,
    sortBy: string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    page: number = 1,
    limit: number = 10,
  ) {
    const queryBuilder = this.locationRepository
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.creator', 'creator')
      .where('location.deletedAt IS NULL');

    // Apply search filter
    if (search) {
      queryBuilder.andWhere(
        '(location.name LIKE :search OR location.province LIKE :search OR location.district LIKE :search OR location.address LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply active filter
    if (isActive !== undefined) {
      queryBuilder.andWhere('location.isActive = :isActive', { isActive });
    }

    // Apply sorting
    const allowedSortFields = ['name', 'province', 'district', 'createdAt'];
    if (allowedSortFields.includes(sortBy)) {
      queryBuilder.orderBy(`location.${sortBy}`, sortOrder);
    } else {
      queryBuilder.orderBy('location.createdAt', 'DESC');
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

  async findOne(id: number): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['creator', 'updater'],
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    return location;
  }

  async update(id: number, updateLocationDto: UpdateLocationDto, userId: number): Promise<Location> {
    const location = await this.findOne(id);

    Object.assign(location, updateLocationDto);
    location.updatedBy = userId;

    return this.locationRepository.save(location);
  }

  async remove(id: number, userId: number): Promise<void> {
    const location = await this.findOne(id);

    location.isActive = false;
    location.deletedAt = new Date();
    location.deletedBy = userId;

    await this.locationRepository.save(location);
  }
}
