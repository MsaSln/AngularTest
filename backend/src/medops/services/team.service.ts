import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, DataSource } from 'typeorm';
import { Team } from '../entities/team.entity';
import { TeamDetail } from '../entities/team-detail.entity';
import { CreateTeamDto, UpdateTeamDto } from '../dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(TeamDetail)
    private teamDetailRepository: Repository<TeamDetail>,
    private dataSource: DataSource,
  ) {}

  async create(createTeamDto: CreateTeamDto, userId: number): Promise<Team> {
    // Check for duplicate team number
    const existingTeamNumber = await this.teamRepository.findOne({
      where: { teamNumber: createTeamDto.teamNumber, deletedAt: IsNull() },
    });
    if (existingTeamNumber) {
      throw new ConflictException('Team with this team number already exists');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create team
      const team = this.teamRepository.create({
        name: createTeamDto.name,
        teamNumber: createTeamDto.teamNumber,
        teamTypeId: createTeamDto.teamTypeId,
        detailTypeId: createTeamDto.detailTypeId,
        createdBy: userId,
        updatedBy: userId,
      });

      const savedTeam = await queryRunner.manager.save(team);

      // Create team details if provided
      if (createTeamDto.teamDetails && createTeamDto.teamDetails.length > 0) {
        const teamDetails = createTeamDto.teamDetails.map((detail, index) => {
          this.validateTeamDetail(detail);

          return this.teamDetailRepository.create({
            teamId: savedTeam.id,
            locationId: detail.locationId,
            vehicleId: detail.vehicleId,
            personnelId: detail.personnelId,
            displayOrder: detail.displayOrder ?? index,
            createdBy: userId,
            updatedBy: userId,
          });
        });

        await queryRunner.manager.save(teamDetails);
      }

      await queryRunner.commitTransaction();

      return this.findOne(savedTeam.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    search?: string,
    isActive?: boolean,
    teamTypeId?: number,
    detailTypeId?: number,
    sortBy: string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    page: number = 1,
    limit: number = 10,
  ) {
    const queryBuilder = this.teamRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.creator', 'creator')
      .leftJoinAndSelect('team.teamType', 'teamType')
      .leftJoinAndSelect('team.detailType', 'detailType')
      .where('team.deletedAt IS NULL');

    // Apply search filter
    if (search) {
      queryBuilder.andWhere(
        '(team.name LIKE :search OR team.teamNumber LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply active filter
    if (isActive !== undefined) {
      queryBuilder.andWhere('team.isActive = :isActive', { isActive });
    }

    // Apply team type filter
    if (teamTypeId) {
      queryBuilder.andWhere('team.teamTypeId = :teamTypeId', { teamTypeId });
    }

    // Apply detail type filter
    if (detailTypeId) {
      queryBuilder.andWhere('team.detailTypeId = :detailTypeId', { detailTypeId });
    }

    // Apply sorting
    const allowedSortFields = ['name', 'teamNumber', 'createdAt'];
    if (allowedSortFields.includes(sortBy)) {
      queryBuilder.orderBy(`team.${sortBy}`, sortOrder);
    } else {
      queryBuilder.orderBy('team.createdAt', 'DESC');
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

  async findOne(id: number): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: [
        'creator',
        'updater',
        'teamType',
        'detailType',
        'teamDetails',
        'teamDetails.location',
        'teamDetails.vehicle',
        'teamDetails.personnel',
      ],
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    // Filter out deleted team details
    if (team.teamDetails) {
      team.teamDetails = team.teamDetails.filter(detail => !detail.deletedAt);
    }

    return team;
  }

  async update(id: number, updateTeamDto: UpdateTeamDto, userId: number): Promise<Team> {
    const team = await this.findOne(id);

    // Check for duplicate team number if changed
    if (updateTeamDto.teamNumber && updateTeamDto.teamNumber !== team.teamNumber) {
      const existingTeamNumber = await this.teamRepository.findOne({
        where: { teamNumber: updateTeamDto.teamNumber, deletedAt: IsNull() },
      });
      if (existingTeamNumber) {
        throw new ConflictException('Team with this team number already exists');
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update team basic info
      Object.assign(team, {
        name: updateTeamDto.name ?? team.name,
        teamNumber: updateTeamDto.teamNumber ?? team.teamNumber,
        teamTypeId: updateTeamDto.teamTypeId ?? team.teamTypeId,
        detailTypeId: updateTeamDto.detailTypeId ?? team.detailTypeId,
        isActive: updateTeamDto.isActive ?? team.isActive,
        updatedBy: userId,
      });

      await queryRunner.manager.save(team);

      // Update team details if provided
      if (updateTeamDto.teamDetails) {
        // Get existing team details
        const existingDetails = await this.teamDetailRepository.find({
          where: { teamId: id, deletedAt: IsNull() },
        });

        const updatedDetailIds: number[] = [];

        // Update or create team details
        for (const detailDto of updateTeamDto.teamDetails) {
          this.validateTeamDetail(detailDto);

          if (detailDto.id) {
            // Update existing detail
            const existingDetail = existingDetails.find(d => d.id === detailDto.id);
            if (existingDetail) {
              Object.assign(existingDetail, {
                locationId: detailDto.locationId,
                vehicleId: detailDto.vehicleId,
                personnelId: detailDto.personnelId,
                displayOrder: detailDto.displayOrder ?? existingDetail.displayOrder,
                isActive: detailDto.isActive ?? existingDetail.isActive,
                updatedBy: userId,
              });
              await queryRunner.manager.save(existingDetail);
              updatedDetailIds.push(existingDetail.id);
            }
          } else {
            // Create new detail
            const newDetail = this.teamDetailRepository.create({
              teamId: id,
              locationId: detailDto.locationId,
              vehicleId: detailDto.vehicleId,
              personnelId: detailDto.personnelId,
              displayOrder: detailDto.displayOrder ?? 0,
              createdBy: userId,
              updatedBy: userId,
            });
            const savedDetail = await queryRunner.manager.save(newDetail);
            updatedDetailIds.push(savedDetail.id);
          }
        }

        // Soft delete team details that were not in the update
        for (const existingDetail of existingDetails) {
          if (!updatedDetailIds.includes(existingDetail.id)) {
            existingDetail.isActive = false;
            existingDetail.deletedAt = new Date();
            existingDetail.deletedBy = userId;
            await queryRunner.manager.save(existingDetail);
          }
        }
      }

      await queryRunner.commitTransaction();

      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number, userId: number): Promise<void> {
    const team = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Soft delete team
      team.isActive = false;
      team.deletedAt = new Date();
      team.deletedBy = userId;
      await queryRunner.manager.save(team);

      // Soft delete all team details
      const teamDetails = await this.teamDetailRepository.find({
        where: { teamId: id, deletedAt: IsNull() },
      });

      for (const detail of teamDetails) {
        detail.isActive = false;
        detail.deletedAt = new Date();
        detail.deletedBy = userId;
        await queryRunner.manager.save(detail);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private validateTeamDetail(detail: any): void {
    const hasLocation = !!detail.locationId;
    const hasVehicle = !!detail.vehicleId;
    const hasPersonnel = !!detail.personnelId;

    // At least one must be set
    if (!hasLocation && !hasVehicle && !hasPersonnel) {
      throw new BadRequestException('Team detail must have at least one of: locationId, vehicleId, or personnelId');
    }
  }
}
