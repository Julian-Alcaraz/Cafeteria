import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { Product } from '../../catalog/entities/product.entity.js';

@Entity('stocks')
export class Stock extends BaseEntity {
  @Column({ unique: true })
  productId: number;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Relation<Product>;

  @Column({ type: 'decimal', precision: 10, scale: 4, default: 0 })
  quantityAvailable: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, default: 0 })
  quantityReserved: number;

  @Column()
  unit: string;
}
