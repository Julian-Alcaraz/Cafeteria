import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CatalogService } from './catalog.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { CreateCoffeeVarietyDto } from './dto/create-coffee-variety.dto.js';
import { UpdateCoffeeVarietyDto } from './dto/update-coffee-variety.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@ApiTags('catalog')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  // ─── PRODUCT TYPES ────────────────────────────────────────────────────────

  @ApiOperation({ summary: 'Obtener todos los tipos de producto' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de producto.' })
  @Get('product-types')
  findAllProductTypes() {
    return this.catalogService.findAllProductTypes();
  }

  // ─── CATEGORIES ───────────────────────────────────────────────────────────

  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiResponse({ status: 200, description: 'Lista de categorías con árbol padre-hijo.' })
  @Get('categories')
  findAllCategories() {
    return this.catalogService.findAllCategories();
  }

  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  @ApiResponse({ status: 200, description: 'Categoría encontrada.' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
  @Get('categories/:id')
  findOneCategory(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.findOneCategory(id);
  }

  @ApiOperation({ summary: 'Crear una categoría' })
  @ApiResponse({ status: 201, description: 'Categoría creada.' })
  @Post('categories')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.catalogService.createCategory(dto);
  }

  @ApiOperation({ summary: 'Actualizar una categoría' })
  @Patch('categories/:id')
  updateCategory(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    return this.catalogService.updateCategory(id, dto);
  }

  @ApiOperation({ summary: 'Deshabilitar una categoría' })
  @Delete('categories/:id')
  removeCategory(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.removeCategory(id);
  }

  // ─── PRODUCTS ─────────────────────────────────────────────────────────────

  @ApiOperation({ summary: 'Listar productos con filtros opcionales' })
  @ApiQuery({ name: 'typeCode', required: false, description: 'SALEABLE | INGREDIENT | ELABORATED | COFFEE_BEAN' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'search', required: false, description: 'Búsqueda por nombre o SKU' })
  @ApiResponse({ status: 200, description: 'Lista de productos.' })
  @Get('products')
  findAllProducts(
    @Query('typeCode') typeCode?: string,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    return this.catalogService.findAllProducts({
      typeCode,
      categoryId: categoryId ? Number(categoryId) : undefined,
      search,
    });
  }

  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto encontrado.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  @Get('products/:id')
  findOneProduct(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.findOneProduct(id);
  }

  @ApiOperation({ summary: 'Crear un producto' })
  @ApiResponse({ status: 201, description: 'Producto creado.' })
  @Post('products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.catalogService.createProduct(dto);
  }

  @ApiOperation({ summary: 'Actualizar un producto' })
  @Patch('products/:id')
  updateProduct(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.catalogService.updateProduct(id, dto);
  }

  @ApiOperation({ summary: 'Deshabilitar un producto (soft delete)' })
  @Delete('products/:id')
  removeProduct(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.removeProduct(id);
  }

  // ─── COFFEE VARIETIES ─────────────────────────────────────────────────────

  @ApiOperation({ summary: 'Listar variedades de café' })
  @ApiResponse({ status: 200, description: 'Lista de variedades de café.' })
  @Get('coffee-varieties')
  findAllCoffeeVarieties() {
    return this.catalogService.findAllCoffeeVarieties();
  }

  @ApiOperation({ summary: 'Obtener una variedad de café por ID' })
  @ApiResponse({ status: 200, description: 'Variedad encontrada.' })
  @ApiResponse({ status: 404, description: 'Variedad no encontrada.' })
  @Get('coffee-varieties/:id')
  findOneCoffeeVariety(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.findOneCoffeeVariety(id);
  }

  @ApiOperation({ summary: 'Crear una variedad de café (vinculada a un producto COFFEE_BEAN)' })
  @ApiResponse({ status: 201, description: 'Variedad de café creada.' })
  @Post('coffee-varieties')
  createCoffeeVariety(@Body() dto: CreateCoffeeVarietyDto) {
    return this.catalogService.createCoffeeVariety(dto);
  }

  @ApiOperation({ summary: 'Actualizar una variedad de café' })
  @Patch('coffee-varieties/:id')
  updateCoffeeVariety(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCoffeeVarietyDto) {
    return this.catalogService.updateCoffeeVariety(id, dto);
  }

  @ApiOperation({ summary: 'Deshabilitar una variedad de café' })
  @Delete('coffee-varieties/:id')
  removeCoffeeVariety(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.removeCoffeeVariety(id);
  }
}
