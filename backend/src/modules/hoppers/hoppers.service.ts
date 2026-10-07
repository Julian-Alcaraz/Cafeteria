import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { HopperConfig } from './entities/hopper-config.entity.js';
import { CreateHopperConfigDto } from './dto/create-hopper-config.dto.js';
import { Product } from '../catalog/entities/product.entity.js';

@Injectable()
export class HoppersService {
  constructor(
    @InjectRepository(HopperConfig)
    private readonly hopperConfigRepo: Repository<HopperConfig>,
    private readonly dataSource: DataSource,
  ) {}

  async getActiveConfigs(): Promise<HopperConfig[]> {
    return this.hopperConfigRepo.find({
      where: { isActive: true },
      relations: { product: true },
      order: { slotNumber: 'ASC' },
    });
  }

  async getConfigHistory(slotNumber: number): Promise<HopperConfig[]> {
    return this.hopperConfigRepo.find({
      where: { slotNumber },
      relations: { product: true, configuredByUser: true },
      order: { configDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async setActiveConfig(createDto: CreateHopperConfigDto, userId: number): Promise<HopperConfig> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Verify product exists
      const product = await queryRunner.manager.findOne(Product, {
        where: { id: createDto.productId },
        relations: { productType: true },
      });

      if (!product) {
        throw new BadRequestException('Producto no encontrado');
      }

      // Check if it's actually coffee beans
      // Depending on how ProductType is coded, we might check a code.
      // For now, let's just allow it, but we could enforce productType.code === 'COFFEE_BEAN'

      // 2. Deactivate current active config for this slot
      await queryRunner.manager.update(
        HopperConfig,
        { slotNumber: createDto.slotNumber, isActive: true },
        { isActive: false },
      );

      // 3. Create new config
      const today = new Date().toISOString().split('T')[0];

      const newConfig = queryRunner.manager.create(HopperConfig, {
        slotNumber: createDto.slotNumber,
        productId: createDto.productId,
        configuredByUserId: userId,
        configDate: today,
        isActive: true,
      });

      const saved = await queryRunner.manager.save(newConfig);

      await queryRunner.commitTransaction();
      return saved;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
