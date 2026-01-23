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
import { VehicleService } from '../services/vehicle.service';
import { CreateVehicleDto, UpdateVehicleDto } from '../dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/permissions.guard';
import { RequirePermissions } from '../../auth/permissions.decorator';

@Controller('medops/vehicles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @RequirePermissions('vehicles.create')
  create(@Body() createVehicleDto: CreateVehicleDto, @Request() req) {
    return this.vehicleService.create(createVehicleDto, req.user.userId);
  }

  @Get()
  @RequirePermissions('vehicles.view')
  findAll(
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.vehicleService.findAll(
      search,
      isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      sortBy,
      sortOrder,
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Get(':id')
  @RequirePermissions('vehicles.view')
  findOne(@Param('id') id: string) {
    return this.vehicleService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions('vehicles.update')
  update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
    @Request() req,
  ) {
    return this.vehicleService.update(+id, updateVehicleDto, req.user.userId);
  }

  @Delete(':id')
  @RequirePermissions('vehicles.delete')
  remove(@Param('id') id: string, @Request() req) {
    return this.vehicleService.remove(+id, req.user.userId);
  }
}
