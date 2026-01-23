import { Location } from './location.model';
import { Vehicle } from './vehicle.model';
import { Personnel } from './personnel.model';

export interface TeamType {
  id: number;
  name: string;
  code: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamDetailType {
  id: number;
  name: string;
  code: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamDetail {
  id: number;
  teamId: number;
  locationId?: number;
  vehicleId?: number;
  personnelId?: number;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  createdBy?: number;
  updatedAt: Date;
  updatedBy?: number;
  deletedAt?: Date;
  deletedBy?: number;
  location?: Location;
  vehicle?: Vehicle;
  personnel?: Personnel;
}

export interface Team {
  id: number;
  name: string;
  teamNumber: string;
  teamTypeId: number;
  detailTypeId: number;
  isActive: boolean;
  createdAt: Date;
  createdBy?: number;
  updatedAt: Date;
  updatedBy?: number;
  deletedAt?: Date;
  deletedBy?: number;
  creator?: {
    id: number;
    username: string;
  };
  updater?: {
    id: number;
    username: string;
  };
  teamType?: TeamType;
  detailType?: TeamDetailType;
  teamDetails?: TeamDetail[];
}

export interface CreateTeamDetailDto {
  locationId?: number;
  vehicleId?: number;
  personnelId?: number;
  displayOrder?: number;
}

export interface CreateTeamDto {
  name: string;
  teamNumber: string;
  teamTypeId: number;
  detailTypeId: number;
  teamDetails?: CreateTeamDetailDto[];
}

export interface UpdateTeamDetailDto {
  id?: number;
  locationId?: number;
  vehicleId?: number;
  personnelId?: number;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateTeamDto {
  name?: string;
  teamNumber?: string;
  teamTypeId?: number;
  detailTypeId?: number;
  isActive?: boolean;
  teamDetails?: UpdateTeamDetailDto[];
}
