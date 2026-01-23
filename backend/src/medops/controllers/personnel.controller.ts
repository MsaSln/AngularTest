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
import { PersonnelService } from '../services/personnel.service';
import { CreatePersonnelDto, UpdatePersonnelDto } from '../dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/permissions.guard';
import { RequirePermissions } from '../../auth/permissions.decorator';

@Controller('medops/personnel')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PersonnelController {
  constructor(private readonly personnelService: PersonnelService) {}

  @Post()
  @RequirePermissions('personnel.create')
  create(@Body() createPersonnelDto: CreatePersonnelDto, @Request() req) {
    return this.personnelService.create(createPersonnelDto, req.user.userId);
  }

  @Get()
  @RequirePermissions('personnel.view')
  findAll(
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.personnelService.findAll(
      search,
      isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      sortBy,
      sortOrder,
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Get(':id')
  @RequirePermissions('personnel.view')
  findOne(@Param('id') id: string) {
    return this.personnelService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions('personnel.update')
  update(
    @Param('id') id: string,
    @Body() updatePersonnelDto: UpdatePersonnelDto,
    @Request() req,
  ) {
    return this.personnelService.update(+id, updatePersonnelDto, req.user.userId);
  }

  @Delete(':id')
  @RequirePermissions('personnel.delete')
  remove(@Param('id') id: string, @Request() req) {
    return this.personnelService.remove(+id, req.user.userId);
  }
}
