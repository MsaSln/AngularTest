import { IsString, IsBoolean, IsOptional, IsArray, IsInt } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  permissionIds?: number[];
}
