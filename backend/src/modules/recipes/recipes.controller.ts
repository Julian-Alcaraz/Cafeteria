import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RecipesService } from './recipes.service.js';
import { CreateRecipeDto } from './dto/create-recipe.dto.js';
import { UpdateRecipeDto } from './dto/update-recipe.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@ApiTags('recipes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @ApiOperation({ summary: 'Listar todas las recetas (todas las versiones)' })
  @ApiResponse({ status: 200, description: 'Lista de recetas.' })
  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una receta por ID' })
  @ApiResponse({ status: 200, description: 'Receta encontrada.' })
  @ApiResponse({ status: 404, description: 'Receta no encontrada.' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recipesService.findOne(id);
  }

  @ApiOperation({ summary: 'Obtener la receta ACTIVA de un producto' })
  @ApiResponse({ status: 200, description: 'Receta activa.' })
  @ApiResponse({ status: 404, description: 'Sin receta activa para el producto.' })
  @Get('product/:productId')
  findActiveByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.recipesService.findActiveByProduct(productId);
  }

  @ApiOperation({
    summary: 'Crear una receta nueva',
    description: 'Si ya existe una receta activa para el producto, se desactiva automáticamente y se crea una nueva versión.',
  })
  @ApiResponse({ status: 201, description: 'Receta creada.' })
  @Post()
  create(@Body() dto: CreateRecipeDto) {
    return this.recipesService.create(dto);
  }

  @ApiOperation({
    summary: 'Actualizar una receta',
    description: 'Si se envían ingredientes, se genera una nueva versión. Si solo se actualizan metadatos (nombre, rendimiento), se modifica la receta actual.',
  })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRecipeDto) {
    return this.recipesService.update(id, dto);
  }

  @ApiOperation({ summary: 'Deshabilitar una receta' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recipesService.remove(id);
  }
}
