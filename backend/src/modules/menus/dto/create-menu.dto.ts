import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({ example: 'Usuarios', description: 'Nombre del menú' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiPropertyOptional({ example: 'users-icon', description: 'Icono del menú' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ example: '/app/usuarios', description: 'URL del menú' })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID del menú padre' })
  @IsNumber()
  @IsOptional()
  parent_id?: number;

  @ApiPropertyOptional({ example: 1, description: 'ID del permiso requerido' })
  @IsNumber()
  @IsOptional()
  permission_id?: number;
}
