import { Type } from 'class-transformer';
import {
  IsString, IsOptional, IsNumber, IsBoolean,
  IsArray, ValidateNested, IsPositive,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRecipeIngredientDto {
  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  productId?: number;

  @ApiPropertyOptional({ example: 300 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional({ example: 'ML' })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isHopperSlot?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  hopperSlotNumber?: number;

  @ApiPropertyOptional({ example: 'Triple shot' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateRecipeDto {
  @ApiPropertyOptional({ example: 'Latte Grande' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsNumber()
  @IsOptional()
  yieldQty?: number;

  @ApiPropertyOptional({ example: 'UNIT' })
  @IsString()
  @IsOptional()
  yieldUnit?: string;

  @ApiPropertyOptional({
    type: [UpdateRecipeIngredientDto],
    description: 'Si se envían ingredientes, reemplaza la lista completa',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateRecipeIngredientDto)
  @IsOptional()
  ingredients?: UpdateRecipeIngredientDto[];
}
