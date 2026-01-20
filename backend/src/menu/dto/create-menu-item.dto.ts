import { IsString, IsOptional, IsInt, IsBoolean, IsEnum } from 'class-validator';
import { MenuLocation } from '../entities/menu-item.entity';

export class CreateMenuItemDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  route: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsEnum(MenuLocation)
  location: MenuLocation;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsInt()
  menuGroupId: number;
}
