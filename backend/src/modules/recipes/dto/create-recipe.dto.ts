import { Type } from 'class-transformer';
import {
  IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean,
  IsArray, ValidateNested, IsPositive,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRecipeIngredientDto {
  @ApiProperty({ example: 1, description: 'ID del producto insumo' })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 250, description: 'Cantidad del ingrediente' })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 'ML', description: 'Unidad de medida' })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiPropertyOptional({ example: false, description: 'Si true, usa el café de la tolva activa (no apunta a producto fijo)' })
  @IsBoolean()
  @IsOptional()
  isHopperSlot?: boolean;

  @ApiPropertyOptional({ example: 1, description: 'Número de slot de tolva (requerido si isHopperSlot = true)' })
  @IsNumber()
  @IsOptional()
  hopperSlotNumber?: number;

  @ApiPropertyOptional({ example: 'Shot doble de espresso' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateRecipeDto {
  @ApiProperty({ example: 1, description: 'ID del producto elaborado al que pertenece la receta' })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 'Latte Estándar', description: 'Nombre descriptivo de la receta' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 1, description: 'Cantidad que rinde la receta' })
  @IsNumber()
  @IsOptional()
  yieldQty?: number;

  @ApiPropertyOptional({ example: 'UNIT', description: 'Unidad del rendimiento' })
  @IsString()
  @IsOptional()
  yieldUnit?: string;

  @ApiProperty({ type: [CreateRecipeIngredientDto], description: 'Lista de ingredientes' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeIngredientDto)
  ingredients: CreateRecipeIngredientDto[];
}
