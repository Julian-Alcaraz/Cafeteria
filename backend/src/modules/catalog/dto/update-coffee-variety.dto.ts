import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCoffeeVarietyDto {
  @ApiPropertyOptional({ example: 'Brasil' })
  @IsString()
  @IsOptional()
  origin?: string;

  @ApiPropertyOptional({ example: 'natural' })
  @IsString()
  @IsOptional()
  process?: string;

  @ApiPropertyOptional({ example: 'oscuro' })
  @IsString()
  @IsOptional()
  roastLevel?: string;

  @ApiPropertyOptional({ example: 'Notas de frutos secos' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  deshabilitado?: boolean;
}
