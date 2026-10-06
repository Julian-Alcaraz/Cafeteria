import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Bebidas Calientes', description: 'Nombre de la categoría' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'bebidas-calientes', description: 'Slug único (URL-friendly)' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ example: 1, description: 'ID de la categoría padre (null = raíz)' })
  @IsNumber()
  @IsOptional()
  parentId?: number;
}
