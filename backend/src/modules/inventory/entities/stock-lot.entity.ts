import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { Product } from '../../catalog/entities/product.entity.js';
import { PurchaseOrderItem } from '../../purchasing/entities/purchase-order-item.entity.js';

@Entity('stock_lots')
export class StockLot extends BaseEntity {
  @Column()
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Relation<Product>;

  @Column({ nullable: true })
  purchaseOrderItemId: number;

  @ManyToOne(() => PurchaseOrderItem)
  @JoinColumn({ name: 'purchaseOrderItemId' })
  purchaseOrderItem: Relation<PurchaseOrderItem>;

  @Column({ nullable: true })
  lotNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  initialQty: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  remainingQty: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  unitCost: number;

  @Column({ type: 'date', nullable: true })
  expiryDate: string;
}
