import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'admin', description: 'Nombre de usuario' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña del usuario' })
  @IsString()
  @IsNotEmpty()
  password_hash: string;

  @ApiPropertyOptional({ example: 'admin@cafe.com', description: 'Correo electrónico' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+123456789', description: 'Teléfono' })
  @IsString()
  @IsOptional()
  telefono?: string;

  @ApiPropertyOptional({ example: 'Juan', description: 'Nombre' })
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiPropertyOptional({ example: 'Pérez', description: 'Apellido' })
  @IsString()
  @IsOptional()
  apellido?: string;


  @ApiPropertyOptional({ example: [1, 2], description: 'IDs de permisos a asignar' })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  permissionIds?: number[];
}
