import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import type { Product } from './product.entity.js';

@Entity('categories')
export class Category extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  parentId: number;

  @ManyToOne('Category', (category: Category) => category.children, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parentId' })
  parent: Relation<Category>;

  @OneToMany('Category', (category: Category) => category.parent)
  children: Relation<Category>[];

  @OneToMany('Product', (product: Product) => product.category)
  products: Relation<Product>[];
}
