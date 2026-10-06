import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity.js';
import { Category } from './entities/category.entity.js';
import { ProductType } from './entities/product-type.entity.js';
import { CoffeeVariety } from './entities/coffee-variety.entity.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { CreateCoffeeVarietyDto } from './dto/create-coffee-variety.dto.js';
import { UpdateCoffeeVarietyDto } from './dto/update-coffee-variety.dto.js';

@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(ProductType)
    private readonly productTypeRepo: Repository<ProductType>,
    @InjectRepository(CoffeeVariety)
    private readonly coffeeVarietyRepo: Repository<CoffeeVariety>,
  ) {}

  // ─── PRODUCT TYPES ────────────────────────────────────────────────────────

  findAllProductTypes() {
    this.logger.log('CatalogService.findAllProductTypes: Obteniendo tipos de producto');
    return this.productTypeRepo.find({ where: { deshabilitado: false } });
  }

  // ─── CATEGORIES ───────────────────────────────────────────────────────────

  findAllCategories() {
    this.logger.log('CatalogService.findAllCategories: Obteniendo categorías');
    return this.categoryRepo.find({
      where: { deshabilitado: false },
      relations: { parent: true, children: true },
      order: { name: 'ASC' },
    });
  }

  async findOneCategory(id: number) {
    this.logger.log(`CatalogService.findOneCategory: Buscando categoría id=${id}`);
    const category = await this.categoryRepo.findOne({
      where: { id, deshabilitado: false },
      relations: { parent: true, children: true },
    });
    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    return category;
  }

  async createCategory(dto: CreateCategoryDto) {
    this.logger.log(`CatalogService.createCategory: Creando categoría "${dto.name}"`);
    const exists = await this.categoryRepo.findOne({ where: { slug: dto.slug } });
    if (exists) {
      throw new ConflictException(`Ya existe una categoría con el slug "${dto.slug}"`);
    }
    const category = this.categoryRepo.create(dto);
    return this.categoryRepo.save(category);
  }

  async updateCategory(id: number, dto: UpdateCategoryDto) {
    this.logger.log(`CatalogService.updateCategory: Actualizando categoría id=${id}`);
    const category = await this.findOneCategory(id);
    if (dto.slug && dto.slug !== category.slug) {
      const exists = await this.categoryRepo.findOne({ where: { slug: dto.slug } });
      if (exists) {
        throw new ConflictException(`Ya existe una categoría con el slug "${dto.slug}"`);
      }
    }
    Object.assign(category, dto);
    return this.categoryRepo.save(category);
  }

  async removeCategory(id: number) {
    this.logger.log(`CatalogService.removeCategory: Deshabilitando categoría id=${id}`);
    const category = await this.findOneCategory(id);
    category.deshabilitado = true;
    return this.categoryRepo.save(category);
  }

  // ─── PRODUCTS ─────────────────────────────────────────────────────────────

  findAllProducts(filters?: { typeCode?: string; categoryId?: number; search?: string }) {
    this.logger.log('CatalogService.findAllProducts: Obteniendo productos');
    const qb = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productType', 'productType')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.deshabilitado = false');

    if (filters?.typeCode) {
      qb.andWhere('productType.code = :typeCode', { typeCode: filters.typeCode });
    }
    if (filters?.categoryId) {
      qb.andWhere('product.categoryId = :categoryId', { categoryId: filters.categoryId });
    }
    if (filters?.search) {
      qb.andWhere('(LOWER(product.name) LIKE :search OR LOWER(product.sku) LIKE :search)', {
        search: `%${filters.search.toLowerCase()}%`,
      });
    }

    return qb.orderBy('product.name', 'ASC').getMany();
  }

  async findOneProduct(id: number) {
    this.logger.log(`CatalogService.findOneProduct: Buscando producto id=${id}`);
    const product = await this.productRepo.findOne({
      where: { id, deshabilitado: false },
      relations: { productType: true, category: true },
    });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  async createProduct(dto: CreateProductDto) {
    this.logger.log(`CatalogService.createProduct: Creando producto "${dto.name}"`);
    if (dto.sku) {
      const exists = await this.productRepo.findOne({ where: { sku: dto.sku } });
      if (exists) {
        throw new ConflictException(`Ya existe un producto con el SKU "${dto.sku}"`);
      }
    }
    const product = this.productRepo.create(dto);
    return this.productRepo.save(product);
  }

  async updateProduct(id: number, dto: UpdateProductDto) {
    this.logger.log(`CatalogService.updateProduct: Actualizando producto id=${id}`);
    const product = await this.findOneProduct(id);
    if (dto.sku && dto.sku !== product.sku) {
      const exists = await this.productRepo.findOne({ where: { sku: dto.sku } });
      if (exists) {
        throw new ConflictException(`Ya existe un producto con el SKU "${dto.sku}"`);
      }
    }
    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  async removeProduct(id: number) {
    this.logger.log(`CatalogService.removeProduct: Deshabilitando producto id=${id}`);
    const product = await this.findOneProduct(id);
    product.deshabilitado = true;
    return this.productRepo.save(product);
  }

  // ─── COFFEE VARIETIES ─────────────────────────────────────────────────────

  findAllCoffeeVarieties() {
    this.logger.log('CatalogService.findAllCoffeeVarieties: Obteniendo variedades de café');
    return this.coffeeVarietyRepo.find({
      where: { deshabilitado: false },
      relations: { product: true },
      order: { origin: 'ASC' },
    });
  }

  async findOneCoffeeVariety(id: number) {
    this.logger.log(`CatalogService.findOneCoffeeVariety: Buscando variedad id=${id}`);
    const variety = await this.coffeeVarietyRepo.findOne({
      where: { id, deshabilitado: false },
      relations: { product: true },
    });
    if (!variety) {
      throw new NotFoundException(`Variedad de café con ID ${id} no encontrada`);
    }
    return variety;
  }

  async createCoffeeVariety(dto: CreateCoffeeVarietyDto) {
    this.logger.log(`CatalogService.createCoffeeVariety: Creando variedad para productId=${dto.productId}`);
    const exists = await this.coffeeVarietyRepo.findOne({ where: { productId: dto.productId } });
    if (exists) {
      throw new ConflictException(`El producto ${dto.productId} ya tiene una variedad de café asociada`);
    }
    const variety = this.coffeeVarietyRepo.create(dto);
    return this.coffeeVarietyRepo.save(variety);
  }

  async updateCoffeeVariety(id: number, dto: UpdateCoffeeVarietyDto) {
    this.logger.log(`CatalogService.updateCoffeeVariety: Actualizando variedad id=${id}`);
    const variety = await this.findOneCoffeeVariety(id);
    Object.assign(variety, dto);
    return this.coffeeVarietyRepo.save(variety);
  }

  async removeCoffeeVariety(id: number) {
    this.logger.log(`CatalogService.removeCoffeeVariety: Deshabilitando variedad id=${id}`);
    const variety = await this.findOneCoffeeVariety(id);
    variety.deshabilitado = true;
    return this.coffeeVarietyRepo.save(variety);
  }
}
