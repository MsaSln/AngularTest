import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Location,
  Vehicle,
  Personnel,
  Team,
  TeamDetail,
  TeamType,
  TeamDetailType,
} from './entities';
import {
  VehicleService,
  LocationService,
  PersonnelService,
  TeamService,
} from './services';
import {
  VehicleController,
  LocationController,
  PersonnelController,
  TeamController,
} from './controllers';
import { TeamTypesController } from './controllers/team-types.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Location,
      Vehicle,
      Personnel,
      Team,
      TeamDetail,
      TeamType,
      TeamDetailType,
    ]),
  ],
  controllers: [
    VehicleController,
    LocationController,
    PersonnelController,
    TeamController,
    TeamTypesController,
  ],
  providers: [
    VehicleService,
    LocationService,
    PersonnelService,
    TeamService,
  ],
  exports: [
    VehicleService,
    LocationService,
    PersonnelService,
    TeamService,
  ],
})
export class MedOpsModule {}
