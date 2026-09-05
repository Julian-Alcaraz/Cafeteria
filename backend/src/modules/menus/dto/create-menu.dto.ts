import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  url?: string;

  @IsNumber()
  @IsOptional()
  parent_id?: number;

  @IsNumber()
  @IsOptional()
  permission_id?: number;
}
