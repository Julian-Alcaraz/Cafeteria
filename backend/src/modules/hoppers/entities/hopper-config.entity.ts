import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { Product } from '../../catalog/entities/product.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity('hopper_configs')
export class HopperConfig extends BaseEntity {
  @Column({ type: 'date' })
  configDate: string; // YYYY-MM-DD

  @Column()
  slotNumber: number;

  @Column()
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Relation<Product>;

  @Column()
  configuredByUserId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'configuredByUserId' })
  configuredByUser: Relation<User>;

  @Column({ default: true })
  isActive: boolean;
}
