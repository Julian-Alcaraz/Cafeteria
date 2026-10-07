import { Controller, Get, Param, UseGuards, Post, Body, Request } from '@nestjs/common';
import { InventoryService } from './inventory.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { AddStockDto } from './dto/inventory.dto.js';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('stock')
  getGlobalStock() {
    return this.inventoryService.getGlobalStock();
  }

  @Get('products/:productId/movements')
  getProductMovements(@Param('productId') productId: string) {
    return this.inventoryService.getProductMovements(+productId);
  }

  @Get('products/:productId/lots')
  getActiveLots(@Param('productId') productId: string) {
    return this.inventoryService.getActiveLots(+productId);
  }

  // Endpoint para ajustes manuales de entrada (temporal/excepcional)
  @Post('stock/adjust/in')
  addManualStock(@Body() dto: AddStockDto, @Request() req: any) {
    return this.inventoryService.addStock(dto, req.user.userId);
  }
}
