import { IsString, IsNotEmpty, IsOptional, MaxLength, Matches } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(3)
  @Matches(/^\d{2,3}$/, { message: 'Province must be 2-3 digits' })
  plateProvince: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  @Matches(/^[A-Z]{1,5}$/, { message: 'Letters must be 1-5 uppercase letters' })
  plateLetters: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  @Matches(/^\d{1,5}$/, { message: 'Numbers must be 1-5 digits' })
  plateNumbers: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  vehicleNumber: string;

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
}
