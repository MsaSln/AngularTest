export interface Permission {
  id: number;
  name: string;
  description: string;
  resource?: string;
  action?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePermissionDto {
  name: string;
  description: string;
  resource?: string;
  action?: string;
}

export interface UpdatePermissionDto {
  name?: string;
  description?: string;
  resource?: string;
  action?: string;
}

export interface CreateRoleDto {
  name: string;
  description: string;
  isActive?: boolean;
  permissionIds?: number[];
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  isActive?: boolean;
  permissionIds?: number[];
}
