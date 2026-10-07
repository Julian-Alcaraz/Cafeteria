import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateHopperConfigDto {
  @IsNumber()
  @IsNotEmpty()
  slotNumber: number;

  @IsNumber()
  @IsNotEmpty()
  productId: number;
}
