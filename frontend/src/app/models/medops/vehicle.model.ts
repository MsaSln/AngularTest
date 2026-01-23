export interface Vehicle {
  id: number;
  plate: string;
  plateProvince: string;
  plateLetters: string;
  plateNumbers: string;
  vehicleNumber: string;
  brand?: string;
  model?: string;
  phoneTelsiz?: string;
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

export interface CreateVehicleDto {
  plateProvince: string;
  plateLetters: string;
  plateNumbers: string;
  vehicleNumber: string;
  brand?: string;
  model?: string;
  phoneTelsiz?: string;
}

export interface UpdateVehicleDto {
  plateProvince?: string;
  plateLetters?: string;
  plateNumbers?: string;
  vehicleNumber?: string;
  brand?: string;
  model?: string;
  phoneTelsiz?: string;
  isActive?: boolean;
}
