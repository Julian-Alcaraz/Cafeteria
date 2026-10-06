import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import type { ProductType } from './product-type.entity.js';
import type { Category } from './category.entity.js';

export enum ProductUnit {
  UNIT = 'UNIT',
  KG = 'KG',
  GR = 'GR',
  LT = 'LT',
  ML = 'ML',
}

@Entity('products')
export class Product extends BaseEntity {
  @Column({ nullable: true, unique: true })
  sku: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  productTypeId: number;

  @ManyToOne('ProductType', (pt: ProductType) => pt.products, { eager: true })
  @JoinColumn({ name: 'productTypeId' })
  productType: Relation<ProductType>;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne('Category', (cat: Category) => cat.products, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category: Relation<Category>;

  @Column({ default: ProductUnit.UNIT })
  unit: string;

  @Column({ type: 'numeric', precision: 10, scale: 4, default: 0 })
  costPrice: number;

  @Column({ type: 'numeric', precision: 10, scale: 4, default: 0 })
  salePrice: number;

  @Column({ default: true })
  trackStock: boolean;

  @Column({ default: false })
  isSoldByWeight: boolean;
}
