import { IsNumber, IsNotEmpty, IsEnum, IsString, IsOptional } from 'class-validator';
import { StockMovementType, ReferenceType } from '../entities/stock-movement.entity.js';

export class AddStockDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  unitCost: number;

  @IsEnum(StockMovementType)
  @IsNotEmpty()
  type: StockMovementType;

  @IsEnum(ReferenceType)
  @IsNotEmpty()
  referenceType: ReferenceType;

  @IsNumber()
  @IsOptional()
  referenceId?: number;

  @IsString()
  @IsOptional()
  lotNumber?: string;

  @IsString()
  @IsOptional()
  expiryDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class DeductStockDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsEnum(StockMovementType)
  @IsNotEmpty()
  type: StockMovementType;

  @IsEnum(ReferenceType)
  @IsNotEmpty()
  referenceType: ReferenceType;

  @IsNumber()
  @IsOptional()
  referenceId?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
