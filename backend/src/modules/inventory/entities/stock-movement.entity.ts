import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { Product } from '../../catalog/entities/product.entity.js';
import { StockLot } from './stock-lot.entity.js';
import { User } from '../../users/entities/user.entity.js';

export enum StockMovementType {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
  PRODUCTION = 'PRODUCTION',
  WASTE = 'WASTE',
  ADJUSTMENT = 'ADJUSTMENT',
  TRANSFER = 'TRANSFER',
}

export enum ReferenceType {
  ACCOUNT_ITEM = 'ACCOUNT_ITEM',
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  MANUAL = 'MANUAL',
}

@Entity('stock_movements')
export class StockMovement extends BaseEntity {
  @Column()
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Relation<Product>;

  @Column({ nullable: true })
  stockLotId: number;

  @ManyToOne(() => StockLot)
  @JoinColumn({ name: 'stockLotId' })
  stockLot: Relation<StockLot>;

  @Column({ type: 'varchar' })
  type: StockMovementType;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  unitCost: number;

  @Column({ type: 'varchar' })
  referenceType: ReferenceType;

  @Column({ nullable: true })
  referenceId: number;

  @Column()
  performedByUserId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'performedByUserId' })
  performedByUser: Relation<User>;

  @Column({ nullable: true })
  notes: string;
}
