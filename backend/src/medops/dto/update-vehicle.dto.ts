import { IsString, IsOptional, IsBoolean, MaxLength, Matches } from 'class-validator';

export class UpdateVehicleDto {
  @IsString()
  @IsOptional()
  @MaxLength(3)
  @Matches(/^\d{2,3}$/, { message: 'Province must be 2-3 digits' })
  plateProvince?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5)
  @Matches(/^[A-Z]{1,5}$/, { message: 'Letters must be 1-5 uppercase letters' })
  plateLetters?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5)
  @Matches(/^\d{1,5}$/, { message: 'Numbers must be 1-5 digits' })
  plateNumbers?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  vehicleNumber?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  brand?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  model?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  phoneTelsiz?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
