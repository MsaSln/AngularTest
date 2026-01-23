import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  province: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  district: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  address?: string;
}
