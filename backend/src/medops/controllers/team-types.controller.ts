import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TeamType } from '../entities/team-type.entity';
import { TeamDetailType } from '../entities/team-detail-type.entity';

@Controller('medops/team-types')
@UseGuards(JwtAuthGuard)
export class TeamTypesController {
  constructor(
    @InjectRepository(TeamType)
    private teamTypeRepository: Repository<TeamType>,
    @InjectRepository(TeamDetailType)
    private teamDetailTypeRepository: Repository<TeamDetailType>,
  ) {}

  @Get()
  async getTeamTypes() {
    return this.teamTypeRepository.find({
      where: { isActive: true },
      order: { displayOrder: 'ASC' },
    });
  }

  @Get('detail-types')
  async getTeamDetailTypes() {
    return this.teamDetailTypeRepository.find({
      where: { isActive: true },
      order: { displayOrder: 'ASC' },
    });
  }
}
