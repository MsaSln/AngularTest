import { IsString, IsOptional, IsNumber, IsBoolean, MaxLength, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTeamDetailDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsNumber()
  @IsOptional()
  locationId?: number;

  @IsNumber()
  @IsOptional()
  vehicleId?: number;

  @IsNumber()
  @IsOptional()
  personnelId?: number;

  @IsNumber()
  @IsOptional()
  displayOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateTeamDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  teamNumber?: string;

  @IsNumber()
  @IsOptional()
  teamTypeId?: number;

  @IsNumber()
  @IsOptional()
  detailTypeId?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateTeamDetailDto)
  @IsOptional()
  teamDetails?: UpdateTeamDetailDto[];
}
