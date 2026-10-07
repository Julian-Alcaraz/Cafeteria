import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HoppersService } from './hoppers.service.js';
import { HoppersController } from './hoppers.controller.js';
import { HopperConfig } from './entities/hopper-config.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([HopperConfig])],
  controllers: [HoppersController],
  providers: [HoppersService],
  exports: [HoppersService],
})
export class HoppersModule {}
