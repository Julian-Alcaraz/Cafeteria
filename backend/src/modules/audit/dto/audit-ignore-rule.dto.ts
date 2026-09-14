import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuditIgnoreRuleDto {
  @ApiProperty({ description: 'The exact route or pattern to ignore' })
  @IsString()
  @IsNotEmpty()
  routePattern: string;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateAuditIgnoreRuleDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  routePattern?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
