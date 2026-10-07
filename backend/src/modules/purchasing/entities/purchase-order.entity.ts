import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { Supplier } from './supplier.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { PurchaseOrderItem } from './purchase-order-item.entity.js';

export enum PurchaseOrderStatus {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  RECEIVED = 'RECEIVED',
  PARTIAL = 'PARTIAL',
  CANCELLED = 'CANCELLED',
}

@Entity('purchase_orders')
export class PurchaseOrder extends BaseEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  supplierId: number;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplierId' })
  supplier: Relation<Supplier>;

  @Column({ type: 'varchar', default: PurchaseOrderStatus.DRAFT })
  status: PurchaseOrderStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'date', nullable: true })
  orderedAt: string;

  @Column({ type: 'date', nullable: true })
  expectedAt: string;

  @Column({ type: 'date', nullable: true })
  receivedAt: string;

  @Column()
  createdByUserId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdByUserId' })
  createdByUser: Relation<User>;

  @OneToMany(() => PurchaseOrderItem, item => item.purchaseOrder)
  items: Relation<PurchaseOrderItem[]>;
}
