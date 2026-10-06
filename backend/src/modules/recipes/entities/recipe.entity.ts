import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { Product } from '../../catalog/entities/product.entity.js';
import type { RecipeIngredient } from './recipe-ingredient.entity.js';

@Entity('recipes')
export class Recipe extends BaseEntity {
  @Column()
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  name: string;

  @Column({ default: 1 })
  version: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'numeric', precision: 10, scale: 4, default: 1 })
  yieldQty: number;

  @Column({ default: 'UNIT' })
  yieldUnit: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  validFrom: Date;

  @OneToMany('RecipeIngredient', (ri: RecipeIngredient) => ri.recipe, { cascade: true, eager: true })
  ingredients: Relation<RecipeIngredient>[];
}
