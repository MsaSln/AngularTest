export interface Personnel {
  id: number;
  registrationNumber: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  position?: string;
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

export interface CreatePersonnelDto {
  registrationNumber: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  position?: string;
}

export interface UpdatePersonnelDto {
  registrationNumber?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  position?: string;
  isActive?: boolean;
}
