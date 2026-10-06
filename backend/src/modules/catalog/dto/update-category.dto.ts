import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Bebidas Frías' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'bebidas-frias' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsNumber()
  @IsOptional()
  parentId?: number;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  deshabilitado?: boolean;
}
