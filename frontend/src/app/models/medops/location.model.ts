export interface Location {
  id: number;
  name: string;
  province: string;
  district: string;
  address?: string;
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
}

export interface CreateLocationDto {
  name: string;
  province: string;
  district: string;
  address?: string;
}

export interface UpdateLocationDto {
  name?: string;
  province?: string;
  district?: string;
  address?: string;
  isActive?: boolean;
}
