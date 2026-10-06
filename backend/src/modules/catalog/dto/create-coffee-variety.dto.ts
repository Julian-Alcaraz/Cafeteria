import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCoffeeVarietyDto {
  @ApiProperty({ example: 1, description: 'ID del producto (tipo COFFEE_BEAN) al que pertenece' })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 'Colombia', description: 'País / región de origen' })
  @IsString()
  @IsNotEmpty()
  origin: string;

  @ApiPropertyOptional({ example: 'lavado', description: 'Proceso de beneficio: lavado | natural | honey' })
  @IsString()
  @IsOptional()
  process?: string;

  @ApiPropertyOptional({ example: 'medio', description: 'Nivel de tueste: claro | medio | oscuro' })
  @IsString()
  @IsOptional()
  roastLevel?: string;

  @ApiPropertyOptional({ example: 'Notas cítricas, caramelo', description: 'Notas de cata' })
  @IsString()
  @IsOptional()
  notes?: string;
}
