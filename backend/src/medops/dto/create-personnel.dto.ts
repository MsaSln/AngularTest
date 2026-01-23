import { IsString, IsNotEmpty, IsOptional, MaxLength, IsEmail } from 'class-validator';

export class CreatePersonnelDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  registrationNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

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
}
