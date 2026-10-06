import { Entity, Column, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import type { Product } from './product.entity.js';

export enum ProductTypeCode {
  SALEABLE = 'SALEABLE',
  INGREDIENT = 'INGREDIENT',
  ELABORATED = 'ELABORATED',
  COFFEE_BEAN = 'COFFEE_BEAN',
}

@Entity('product_types')
export class ProductType extends BaseEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @OneToMany('Product', (product: Product) => product.productType)
  products: Relation<Product>[];
}
