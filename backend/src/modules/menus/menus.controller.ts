import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MenusService } from './menus.service.js';
import { CreateMenuDto } from './dto/create-menu.dto.js';
import { UpdateMenuDto } from './dto/update-menu.dto.js';

@ApiTags('menus')
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @ApiOperation({ summary: 'Crear un nuevo menú' })
  @ApiResponse({ status: 201, description: 'Menú creado exitosamente.' })
  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menusService.create(createMenuDto);
  }

  @ApiOperation({ summary: 'Obtener todos los menús' })
  @ApiResponse({ status: 200, description: 'Lista de menús.' })
  @Get()
  findAll() {
    return this.menusService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un menú por ID' })
  @ApiResponse({ status: 200, description: 'Menú encontrado.' })
  @ApiResponse({ status: 404, description: 'Menú no encontrado.' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menusService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un menú' })
  @ApiResponse({ status: 200, description: 'Menú actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Menú no encontrado.' })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menusService.update(id, updateMenuDto);
  }

  @ApiOperation({ summary: 'Eliminar un menú' })
  @ApiResponse({ status: 200, description: 'Menú eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Menú no encontrado.' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menusService.remove(id);
  }
}
