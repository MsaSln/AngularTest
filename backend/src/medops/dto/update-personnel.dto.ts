import { IsString, IsOptional, IsBoolean, MaxLength, IsEmail } from 'class-validator';

export class UpdatePersonnelDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  registrationNumber?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  firstName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  lastName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  phone?: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  position?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
