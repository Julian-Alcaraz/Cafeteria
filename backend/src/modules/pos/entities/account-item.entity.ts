import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import type { Account } from './account.entity.js';
import type { Relation } from 'typeorm';
import { Product } from '../../catalog/entities/product.entity.js';
import { HopperConfig } from '../../hoppers/entities/hopper-config.entity.js';
import { AccountItemStatus } from '../enums/account-item-status.enum.js';

@Entity('account_items')
export class AccountItem extends BaseEntity {
  @Column({ name: 'account_id' })
  accountId: number;

  @ManyToOne('Account', (account: any) => account.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account: Relation<Account>;

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  quantity: number;

  @Column({ type: 'enum', enum: AccountItemStatus, default: AccountItemStatus.PENDING })
  status: AccountItemStatus;

  @Column({ type: 'boolean', default: false })
  isComplimentary: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  complimentaryReason: string;

  @Column({ type: 'decimal', precision: 10, scale: 4, default: 0 })
  remadeQuantity: number;

  @Column({ name: 'hopper_id', nullable: true })
  hopperId: number;

  @ManyToOne(() => HopperConfig, { nullable: true })
  @JoinColumn({ name: 'hopper_id' })
  hopper: HopperConfig;
}
