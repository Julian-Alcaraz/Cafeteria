import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateMenuDto {
  @IsString()
  @IsOptional()
  label?: string;

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
