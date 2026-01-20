export enum MenuLocation {
  SIDEBAR = 'sidebar',
  HEADER = 'header',
  BOTH = 'both',
}

export interface MenuItem {
  id: number;
  title: string;
  description?: string;
  route: string;
  icon?: string;
  location: MenuLocation;
  order: number;
  isActive: boolean;
  menuGroupId: number;
  menuGroup?: MenuGroup;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuGroup {
  id: number;
  name: string;
  icon?: string;
  order: number;
  isActive: boolean;
  menuItems: MenuItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMenuGroupDto {
  name: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateMenuGroupDto {
  name?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
}

export interface CreateMenuItemDto {
  title: string;
  description?: string;
  route: string;
  icon?: string;
  location: MenuLocation;
  order?: number;
  isActive?: boolean;
  menuGroupId: number;
}

export interface UpdateMenuItemDto {
  title?: string;
  description?: string;
  route?: string;
  icon?: string;
  location?: MenuLocation;
  order?: number;
  isActive?: boolean;
  menuGroupId?: number;
}
