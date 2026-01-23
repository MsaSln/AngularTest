import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TeamService } from '../services/team.service';
import { CreateTeamDto, UpdateTeamDto } from '../dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/permissions.guard';
import { RequirePermissions } from '../../auth/permissions.decorator';

@Controller('medops/teams')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @RequirePermissions('teams.create')
  create(@Body() createTeamDto: CreateTeamDto, @Request() req) {
    return this.teamService.create(createTeamDto, req.user.userId);
  }

  @Get()
  @RequirePermissions('teams.view')
  findAll(
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
    @Query('teamTypeId') teamTypeId?: string,
    @Query('detailTypeId') detailTypeId?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.teamService.findAll(
      search,
      isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      teamTypeId ? parseInt(teamTypeId, 10) : undefined,
      detailTypeId ? parseInt(detailTypeId, 10) : undefined,
      sortBy,
      sortOrder,
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Get(':id')
  @RequirePermissions('teams.view')
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions('teams.update')
  update(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
    @Request() req,
  ) {
    return this.teamService.update(+id, updateTeamDto, req.user.userId);
  }

  @Delete(':id')
  @RequirePermissions('teams.delete')
  remove(@Param('id') id: string, @Request() req) {
    return this.teamService.remove(+id, req.user.userId);
  }
}
