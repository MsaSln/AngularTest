import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class UpdateLocationDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  province?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  district?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  address?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
