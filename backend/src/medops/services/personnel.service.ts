import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Personnel } from '../entities/personnel.entity';
import { CreatePersonnelDto, UpdatePersonnelDto } from '../dto';

@Injectable()
export class PersonnelService {
  constructor(
    @InjectRepository(Personnel)
    private personnelRepository: Repository<Personnel>,
  ) {}

  async create(createPersonnelDto: CreatePersonnelDto, userId: number): Promise<Personnel> {
    // Check for duplicate registration number
    const existingRegistrationNumber = await this.personnelRepository.findOne({
      where: { registrationNumber: createPersonnelDto.registrationNumber, deletedAt: IsNull() },
    });
    if (existingRegistrationNumber) {
      throw new ConflictException('Personnel with this registration number already exists');
    }

    const personnel = this.personnelRepository.create({
      ...createPersonnelDto,
      createdBy: userId,
      updatedBy: userId,
    });

    return this.personnelRepository.save(personnel);
  }

  async findAll(
    search?: string,
    isActive?: boolean,
    sortBy: string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    page: number = 1,
    limit: number = 10,
  ) {
    const queryBuilder = this.personnelRepository
      .createQueryBuilder('personnel')
      .leftJoinAndSelect('personnel.creator', 'creator')
      .where('personnel.deletedAt IS NULL');

    // Apply search filter
    if (search) {
      queryBuilder.andWhere(
        '(personnel.registrationNumber LIKE :search OR personnel.firstName LIKE :search OR personnel.lastName LIKE :search OR personnel.phone LIKE :search OR personnel.email LIKE :search OR personnel.position LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply active filter
    if (isActive !== undefined) {
      queryBuilder.andWhere('personnel.isActive = :isActive', { isActive });
    }

    // Apply sorting
    const allowedSortFields = ['registrationNumber', 'firstName', 'lastName', 'position', 'createdAt'];
    if (allowedSortFields.includes(sortBy)) {
      queryBuilder.orderBy(`personnel.${sortBy}`, sortOrder);
    } else {
      queryBuilder.orderBy('personnel.createdAt', 'DESC');
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

  async findOne(id: number): Promise<Personnel> {
    const personnel = await this.personnelRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['creator', 'updater'],
    });

    if (!personnel) {
      throw new NotFoundException(`Personnel with ID ${id} not found`);
    }

    return personnel;
  }

  async update(id: number, updatePersonnelDto: UpdatePersonnelDto, userId: number): Promise<Personnel> {
    const personnel = await this.findOne(id);

    // Check for duplicate registration number if changed
    if (updatePersonnelDto.registrationNumber && updatePersonnelDto.registrationNumber !== personnel.registrationNumber) {
      const existingRegistrationNumber = await this.personnelRepository.findOne({
        where: { registrationNumber: updatePersonnelDto.registrationNumber, deletedAt: IsNull() },
      });
      if (existingRegistrationNumber) {
        throw new ConflictException('Personnel with this registration number already exists');
      }
    }

    Object.assign(personnel, updatePersonnelDto);
    personnel.updatedBy = userId;

    return this.personnelRepository.save(personnel);
  }

  async remove(id: number, userId: number): Promise<void> {
    const personnel = await this.findOne(id);

    personnel.isActive = false;
    personnel.deletedAt = new Date();
    personnel.deletedBy = userId;

    await this.personnelRepository.save(personnel);
  }
}
