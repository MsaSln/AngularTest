import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateMenuGroupDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
