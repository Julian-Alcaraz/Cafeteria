import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { AccountStatus } from '../enums/account-status.enum.js';
import type { AccountItem } from './account-item.entity.js';
import type { Relation } from 'typeorm';

@Entity('accounts')
export class Account extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: true })
  customerName: string;

  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.OPEN })
  status: AccountStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentMethodInfo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tip: number;

  @Column({ type: 'int', nullable: true })
  tableId: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @ManyToOne('User', { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: any;

  @OneToMany('AccountItem', (item: any) => item.account, { cascade: true })
  items: Relation<AccountItem>[];
}
