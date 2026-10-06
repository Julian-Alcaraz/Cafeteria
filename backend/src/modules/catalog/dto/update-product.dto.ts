import { IsString, IsOptional, IsNumber, IsBoolean, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductUnit } from '../entities/product.entity.js';

const VALID_UNITS = Object.values(ProductUnit);

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'CAFE-001' })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({ example: 'Latte Grande' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Descripción actualizada' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsNumber()
  @IsOptional()
  productTypeId?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional({ example: 'GR', description: `Unidad: ${VALID_UNITS.join(' | ')}` })
  @IsString()
  @IsIn(VALID_UNITS)
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional({ example: 200.0 })
  @IsNumber()
  @IsOptional()
  costPrice?: number;

  @ApiPropertyOptional({ example: 400.0 })
  @IsNumber()
  @IsOptional()
  salePrice?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  trackStock?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isSoldByWeight?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Deshabilitar el producto' })
  @IsBoolean()
  @IsOptional()
  deshabilitado?: boolean;
}
