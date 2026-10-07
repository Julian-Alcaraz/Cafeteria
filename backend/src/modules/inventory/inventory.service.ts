import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { Stock } from './entities/stock.entity.js';
import { StockLot } from './entities/stock-lot.entity.js';
import { StockMovement, StockMovementType, ReferenceType } from './entities/stock-movement.entity.js';
import { AddStockDto, DeductStockDto } from './dto/inventory.dto.js';
import { Product } from '../catalog/entities/product.entity.js';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>,
    @InjectRepository(StockLot)
    private readonly lotRepo: Repository<StockLot>,
    @InjectRepository(StockMovement)
    private readonly movementRepo: Repository<StockMovement>,
    private readonly dataSource: DataSource,
  ) {}

  async getGlobalStock(): Promise<Stock[]> {
    return this.stockRepo.find({
      relations: { product: true },
    });
  }

  async getProductMovements(productId: number): Promise<StockMovement[]> {
    return this.movementRepo.find({
      where: { productId },
      relations: { performedByUser: true, stockLot: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getActiveLots(productId: number): Promise<StockLot[]> {
    return this.lotRepo
      .createQueryBuilder('lot')
      .where('lot.productId = :productId', { productId })
      .andWhere('lot.remainingQty > 0')
      .orderBy('lot.createdAt', 'ASC') // FIFO
      .getMany();
  }

  // Se usa transaccional interno o manager provisto
  async addStock(dto: AddStockDto, userId: number, providedManager?: EntityManager): Promise<void> {
    const execute = async (manager: EntityManager) => {
      // 1. Obtener producto y validar
      const product = await manager.findOne(Product, { where: { id: dto.productId } });
      if (!product) throw new BadRequestException('Producto no encontrado');

      // 2. Obtener o crear Stock
      let stock = await manager.findOne(Stock, { where: { productId: dto.productId } });
      if (!stock) {
        stock = manager.create(Stock, {
          productId: dto.productId,
          quantityAvailable: 0,
          quantityReserved: 0,
          unit: product.unit,
        });
      }

      // 3. Crear Lote (StockLot)
      const purchaseOrderItemId = dto.referenceType === ReferenceType.PURCHASE_ORDER ? dto.referenceId : undefined;
      const lot = manager.create(StockLot, {
        productId: dto.productId,
        initialQty: dto.quantity,
        remainingQty: dto.quantity,
        unitCost: dto.unitCost,
        lotNumber: dto.lotNumber,
        expiryDate: dto.expiryDate,
        ...(purchaseOrderItemId ? { purchaseOrderItemId } : {}),
      });
      const savedLot = await manager.save(lot);

      // 4. Actualizar Stock global
      stock.quantityAvailable = Number(stock.quantityAvailable) + Number(dto.quantity);
      await manager.save(stock);

      // 5. Crear Movimiento
      const movement = manager.create(StockMovement, {
        productId: dto.productId,
        stockLotId: savedLot.id,
        type: dto.type,
        quantity: dto.quantity,
        unitCost: dto.unitCost,
        referenceType: dto.referenceType,
        referenceId: dto.referenceId,
        performedByUserId: userId,
        notes: dto.notes,
      });
      await manager.save(movement);
    };

    if (providedManager) {
      await execute(providedManager);
    } else {
      await this.dataSource.transaction(async manager => {
        await execute(manager);
      });
    }
  }

  // Deducción FIFO (repartida en varios lotes si es necesario)
  async deductStock(dto: DeductStockDto, userId: number, providedManager?: EntityManager): Promise<void> {
    const execute = async (manager: EntityManager) => {
      // 1. Obtener y bloquear Stock
      const stock = await manager.findOne(Stock, {
        where: { productId: dto.productId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!stock || Number(stock.quantityAvailable) < Number(dto.quantity)) {
        throw new BadRequestException('Stock insuficiente para el producto');
      }

      // 2. Buscar lotes activos FIFO
      const lots = await manager
        .createQueryBuilder(StockLot, 'lot')
        .where('lot.productId = :productId', { productId: dto.productId })
        .andWhere('lot.remainingQty > 0')
        .orderBy('lot.createdAt', 'ASC')
        .setLock('pessimistic_write')
        .getMany();

      let remainingToDeduct = Number(dto.quantity);

      for (const lot of lots) {
        if (remainingToDeduct <= 0) break;

        const availableInLot = Number(lot.remainingQty);
        const qtyToDeductFromLot = Math.min(availableInLot, remainingToDeduct);

        // Actualizar lote
        lot.remainingQty = availableInLot - qtyToDeductFromLot;
        await manager.save(lot);

        // Crear Movimiento de resta (negativo)
        const movement = manager.create(StockMovement, {
          productId: dto.productId,
          stockLotId: lot.id,
          type: dto.type,
          quantity: -qtyToDeductFromLot, // quantity is negative for deduction
          unitCost: lot.unitCost, // registramos el costo exacto FIFO que salió
          referenceType: dto.referenceType,
          referenceId: dto.referenceId,
          performedByUserId: userId,
          notes: dto.notes,
        });
        await manager.save(movement);

        remainingToDeduct -= qtyToDeductFromLot;
      }

      if (remainingToDeduct > 0) {
        // En teoría no debería pasar si bloqueamos bien y el stock global coincide con la suma de lotes
        throw new InternalServerErrorException('Inconsistencia en lotes de stock');
      }

      // Actualizar Stock global
      stock.quantityAvailable = Number(stock.quantityAvailable) - Number(dto.quantity);
      await manager.save(stock);
    };

    if (providedManager) {
      await execute(providedManager);
    } else {
      await this.dataSource.transaction(async manager => {
        await execute(manager);
      });
    }
  }
}
