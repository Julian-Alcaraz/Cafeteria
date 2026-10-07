import { PartialType } from '@nestjs/mapped-types';
import { CreateHopperConfigDto } from './create-hopper-config.dto.js';

export class UpdateHopperConfigDto extends PartialType(CreateHopperConfigDto) {}
