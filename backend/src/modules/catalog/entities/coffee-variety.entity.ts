import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import type { Product } from './product.entity.js';

@Entity('coffee_varieties')
export class CoffeeVariety extends BaseEntity {
  @Column({ unique: true })
  productId: number;

  @OneToOne('Product', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Relation<Product>;

  @Column()
  origin: string;

  @Column({ nullable: true })
  process: string;

  @Column({ nullable: true })
  roastLevel: string;

  @Column({ nullable: true })
  notes: string;
}
