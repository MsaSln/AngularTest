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

@Controller('medops/teams')
@UseGuards(JwtAuthGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto, @Request() req) {
    return this.teamService.create(createTeamDto, req.user.userId);
  }

  @Get()
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
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
    @Request() req,
  ) {
    return this.teamService.update(+id, updateTeamDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.teamService.remove(+id, req.user.userId);
  }
}
