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
import { LocationService } from '../services/location.service';
import { CreateLocationDto, UpdateLocationDto } from '../dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/permissions.guard';
import { RequirePermissions } from '../../auth/permissions.decorator';

@Controller('medops/locations')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @RequirePermissions('locations.create')
  create(@Body() createLocationDto: CreateLocationDto, @Request() req) {
    return this.locationService.create(createLocationDto, req.user.userId);
  }

  @Get()
  @RequirePermissions('locations.view')
  findAll(
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.locationService.findAll(
      search,
      isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      sortBy,
      sortOrder,
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Get(':id')
  @RequirePermissions('locations.view')
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions('locations.update')
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
    @Request() req,
  ) {
    return this.locationService.update(+id, updateLocationDto, req.user.userId);
  }

  @Delete(':id')
  @RequirePermissions('locations.delete')
  remove(@Param('id') id: string, @Request() req) {
    return this.locationService.remove(+id, req.user.userId);
  }
}
