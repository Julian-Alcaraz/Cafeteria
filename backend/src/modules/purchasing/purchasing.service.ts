import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { Supplier } from './entities/supplier.entity.js';
import { PurchaseOrder, PurchaseOrderStatus } from './entities/purchase-order.entity.js';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity.js';
import { CreateSupplierDto, CreatePurchaseOrderDto } from './dto/purchasing.dto.js';
import { InventoryService } from '../inventory/inventory.service.js';
import { StockMovementType, ReferenceType } from '../inventory/entities/stock-movement.entity.js';

@Injectable()
export class PurchasingService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
    @InjectRepository(PurchaseOrder)
    private readonly poRepo: Repository<PurchaseOrder>,
    private readonly inventoryService: InventoryService,
    private readonly dataSource: DataSource,
  ) {}

  async createSupplier(dto: CreateSupplierDto): Promise<Supplier> {
    const supplier = this.supplierRepo.create(dto);
    return this.supplierRepo.save(supplier);
  }

  async getSuppliers(): Promise<Supplier[]> {
    return this.supplierRepo.find({ order: { name: 'ASC' } });
  }

  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    return this.poRepo.find({
      relations: { supplier: true, createdByUser: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getPurchaseOrderById(id: number): Promise<PurchaseOrder> {
    const po = await this.poRepo.findOne({
      where: { id },
      relations: { supplier: true, items: { product: true } },
    });
    if (!po) throw new NotFoundException('Orden de compra no encontrada');
    return po;
  }

  private generatePOCode(): string {
    const date = new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `OC-${date}-${random}`;
  }

  async createPurchaseOrder(dto: CreatePurchaseOrderDto, userId: number): Promise<PurchaseOrder> {
    return this.dataSource.transaction(async manager => {
      let totalAmount = 0;
      
      const po = manager.create(PurchaseOrder, {
        code: this.generatePOCode(),
        supplierId: dto.supplierId,
        status: PurchaseOrderStatus.DRAFT,
        expectedAt: dto.expectedAt,
        createdByUserId: userId,
        orderedAt: new Date().toISOString().split('T')[0],
      });

      const savedPo = await manager.save(po);

      for (const itemDto of dto.items) {
        const itemTotal = Number(itemDto.quantity) * Number(itemDto.unitCost);
        totalAmount += itemTotal;

        const item = manager.create(PurchaseOrderItem, {
          purchaseOrderId: savedPo.id,
          productId: itemDto.productId,
          quantity: itemDto.quantity,
          unitCost: itemDto.unitCost,
          unit: itemDto.unit,
        });
        await manager.save(item);
      }

      savedPo.totalAmount = totalAmount;
      return manager.save(savedPo);
    });
  }

  async receivePurchaseOrder(poId: number, userId: number): Promise<PurchaseOrder> {
    return this.dataSource.transaction(async manager => {
      const po = await manager.findOne(PurchaseOrder, {
        where: { id: poId },
        lock: { mode: 'pessimistic_write' }
      });

      if (!po) throw new NotFoundException('Orden de compra no encontrada');
      
      const items = await manager.find(PurchaseOrderItem, {
        where: { purchaseOrderId: poId }
      });
      po.items = items;

      if (po.status === PurchaseOrderStatus.RECEIVED) {
        throw new BadRequestException('Esta orden ya fue recibida');
      }

      // Add stock for each item
      for (const item of po.items) {
        item.receivedQty = item.quantity; // Assuming full receipt for now
        await manager.save(item);

        await this.inventoryService.addStock({
          productId: item.productId,
          quantity: item.receivedQty,
          unitCost: item.unitCost,
          type: StockMovementType.PURCHASE,
          referenceType: ReferenceType.PURCHASE_ORDER,
          referenceId: item.id,
          notes: `Recepción de orden ${po.code}`
        }, userId, manager);
      }

      po.status = PurchaseOrderStatus.RECEIVED;
      po.receivedAt = new Date().toISOString().split('T')[0];
      return manager.save(po);
    });
  }
}
