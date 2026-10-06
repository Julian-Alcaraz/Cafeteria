import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import type { Recipe } from './recipe.entity.js';
import { Product } from '../../catalog/entities/product.entity.js';

@Entity('recipe_ingredients')
export class RecipeIngredient extends BaseEntity {
  @Column()
  recipeId: number;

  @ManyToOne('Recipe', (recipe: Recipe) => recipe.ingredients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipeId' })
  recipe: Relation<Recipe>;


  @Column()
  productId: number;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'numeric', precision: 10, scale: 4 })
  quantity: number;

  @Column({ default: 'UNIT' })
  unit: string;

  /**
   * Si es true, este ingrediente se resuelve desde la tolva activa
   * en el momento de la entrega, NO desde un producto fijo.
   * En ese caso, hopperSlotNumber indica qué slot de tolva corresponde.
   */
  @Column({ default: false })
  isHopperSlot: boolean;

  @Column({ nullable: true })
  hopperSlotNumber: number;

  @Column({ nullable: true })
  notes: string;
}
