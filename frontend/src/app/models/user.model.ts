import { Role } from './rbac.model';

export interface User {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  roleIds: number[];
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  roleIds?: number[];
  isActive?: boolean;
}

export interface CreateUserResponse {
  user: User;
  generatedPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
  generatedPassword: string;
}
