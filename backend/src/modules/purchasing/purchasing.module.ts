import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasingService } from './purchasing.service.js';
import { PurchasingController } from './purchasing.controller.js';
import { Supplier } from './entities/supplier.entity.js';
import { PurchaseOrder } from './entities/purchase-order.entity.js';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity.js';
import { InventoryModule } from '../inventory/inventory.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Supplier, PurchaseOrder, PurchaseOrderItem]),
    InventoryModule
  ],
  controllers: [PurchasingController],
  providers: [PurchasingService],
  exports: [PurchasingService],
})
export class PurchasingModule {}
