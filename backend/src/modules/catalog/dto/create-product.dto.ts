import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductUnit } from '../entities/product.entity.js';

const VALID_UNITS = Object.values(ProductUnit);

export class CreateProductDto {
  @ApiPropertyOptional({ example: 'CAFE-001', description: 'SKU único del producto' })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({ example: 'Latte', description: 'Nombre del producto' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Café con leche cremoso', description: 'Descripción' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1, description: 'ID del tipo de producto' })
  @IsNumber()
  @IsNotEmpty()
  productTypeId: number;

  @ApiPropertyOptional({ example: 1, description: 'ID de la categoría' })
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional({ example: 'UNIT', description: `Unidad de medida: ${VALID_UNITS.join(' | ')}` })
  @IsString()
  @IsIn(VALID_UNITS)
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional({ example: 150.0, description: 'Precio de costo' })
  @IsNumber()
  @IsOptional()
  costPrice?: number;

  @ApiPropertyOptional({ example: 350.0, description: 'Precio de venta' })
  @IsNumber()
  @IsOptional()
  salePrice?: number;

  @ApiPropertyOptional({ example: true, description: 'Si se controla stock' })
  @IsBoolean()
  @IsOptional()
  trackStock?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Si se vende por peso' })
  @IsBoolean()
  @IsOptional()
  isSoldByWeight?: boolean;
}
