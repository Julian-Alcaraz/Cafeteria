import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { PurchaseOrder } from './purchase-order.entity.js';
import { Product } from '../../catalog/entities/product.entity.js';

@Entity('purchase_order_items')
export class PurchaseOrderItem extends BaseEntity {
  @Column()
  purchaseOrderId: number;

  @ManyToOne(() => PurchaseOrder, order => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'purchaseOrderId' })
  purchaseOrder: Relation<PurchaseOrder>;

  @Column()
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Relation<Product>;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  unitCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, default: 0 })
  receivedQty: number;

  @Column()
  unit: string;
}
