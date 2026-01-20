import { IsString, IsOptional } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  resource?: string;

  @IsOptional()
  @IsString()
  action?: string;
}
