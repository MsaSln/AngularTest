import { IsString, IsNotEmpty, IsNumber, MaxLength, ValidateNested, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTeamDetailDto {
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
}

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  teamNumber: string;

  @IsNumber()
  @IsNotEmpty()
  teamTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  detailTypeId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTeamDetailDto)
  @IsOptional()
  teamDetails?: CreateTeamDetailDto[];
}
