import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'admin2', description: 'Nombre de usuario' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ example: 'newpassword', description: 'Contraseña del usuario' })
  @IsString()
  @IsOptional()
  password_hash?: string;

  @ApiPropertyOptional({ example: [1, 2, 3], description: 'IDs de permisos a asignar' })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  permissionIds?: number[];
}
