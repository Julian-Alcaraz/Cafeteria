import { Injectable, NotFoundException, UnprocessableEntityException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Recipe } from './entities/recipe.entity.js';
import { RecipeIngredient } from './entities/recipe-ingredient.entity.js';
import { CreateRecipeDto } from './dto/create-recipe.dto.js';
import { UpdateRecipeDto } from './dto/update-recipe.dto.js';
import { ProductTypeCode } from '../catalog/entities/product-type.entity.js';

@Injectable()
export class RecipesService {
  private readonly logger = new Logger(RecipesService.name);

  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepo: Repository<Recipe>,
    @InjectRepository(RecipeIngredient)
    private readonly ingredientRepo: Repository<RecipeIngredient>,
    private readonly dataSource: DataSource,
  ) {}

  // ─── LISTAR ──────────────────────────────────────────────────────────────

  findAll() {
    this.logger.log('RecipesService.findAll: Obteniendo recetas');
    return this.recipeRepo.find({
      where: { deshabilitado: false },
      relations: { product: true, ingredients: { product: true } },
      order: { productId: 'ASC', version: 'DESC' },
    });
  }

  async findOne(id: number) {
    this.logger.log(`RecipesService.findOne: Buscando receta id=${id}`);
    const recipe = await this.recipeRepo.findOne({
      where: { id, deshabilitado: false },
      relations: { product: true, ingredients: { product: true } },
    });
    if (!recipe) {
      throw new NotFoundException(`Receta con ID ${id} no encontrada`);
    }
    return recipe;
  }

  async findActiveByProduct(productId: number) {
    this.logger.log(`RecipesService.findActiveByProduct: Buscando receta activa para producto id=${productId}`);
    const recipe = await this.recipeRepo.findOne({
      where: { productId, isActive: true, deshabilitado: false },
      relations: { product: true, ingredients: { product: true } },
    });
    if (!recipe) {
      throw new NotFoundException(`No hay receta activa para el producto ID ${productId}`);
    }
    return recipe;
  }

  // ─── CREAR ────────────────────────────────────────────────────────────────

  async create(dto: CreateRecipeDto) {
    this.logger.log(`RecipesService.create: Creando receta para producto id=${dto.productId}`);

    // Validar que los ingredientes con isHopperSlot tengan hopperSlotNumber
    for (const ing of dto.ingredients) {
      if (ing.isHopperSlot && !ing.hopperSlotNumber) {
        throw new UnprocessableEntityException(
          'Un ingrediente marcado como tolva (isHopperSlot=true) debe tener hopperSlotNumber definido',
        );
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Desactivar receta anterior del mismo producto (si existe)
      await queryRunner.manager.update(Recipe, { productId: dto.productId, isActive: true }, { isActive: false });

      // Obtener la siguiente versión
      const lastRecipe = await queryRunner.manager.findOne(Recipe, {
        where: { productId: dto.productId },
        order: { version: 'DESC' },
      });
      const nextVersion = (lastRecipe?.version ?? 0) + 1;

      // Crear la nueva receta
      const recipe = queryRunner.manager.create(Recipe, {
        productId: dto.productId,
        name: dto.name,
        version: nextVersion,
        isActive: true,
        yieldQty: dto.yieldQty ?? 1,
        yieldUnit: dto.yieldUnit ?? 'UNIT',
        validFrom: new Date(),
      });
      const savedRecipe = await queryRunner.manager.save(Recipe, recipe);

      // Crear los ingredientes
      const ingredients = dto.ingredients.map((ing) =>
        queryRunner.manager.create(RecipeIngredient, {
          recipeId: savedRecipe.id,
          ...ing,
        }),
      );
      await queryRunner.manager.save(RecipeIngredient, ingredients);

      await queryRunner.commitTransaction();
      this.logger.log(`RecipesService.create: Receta creada id=${savedRecipe.id} versión=${nextVersion}`);

      return this.findOne(savedRecipe.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('RecipesService.create: Error al crear receta', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ─── ACTUALIZAR (CREA NUEVA VERSIÓN) ──────────────────────────────────────

  async update(id: number, dto: UpdateRecipeDto) {
    this.logger.log(`RecipesService.update: Actualizando receta id=${id} (genera nueva versión)`);
    const existing = await this.findOne(id);

    // Actualizar solo metadatos sin cambiar ingredientes
    if (!dto.ingredients) {
      Object.assign(existing, { name: dto.name, yieldQty: dto.yieldQty, yieldUnit: dto.yieldUnit });
      return this.recipeRepo.save(existing);
    }

    // Si trae nuevos ingredientes → crear nueva versión de la receta
    return this.create({
      productId: existing.productId,
      name: dto.name ?? existing.name,
      yieldQty: dto.yieldQty ?? existing.yieldQty,
      yieldUnit: dto.yieldUnit ?? existing.yieldUnit,
      ingredients: dto.ingredients as any,
    });
  }

  // ─── DESHABILITAR ─────────────────────────────────────────────────────────

  async remove(id: number) {
    this.logger.log(`RecipesService.remove: Deshabilitando receta id=${id}`);
    const recipe = await this.findOne(id);
    recipe.deshabilitado = true;
    if (recipe.isActive) recipe.isActive = false;
    return this.recipeRepo.save(recipe);
  }
}
