import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PurchasingService } from './purchasing.service.js';
import { CreateSupplierDto, CreatePurchaseOrderDto } from './dto/purchasing.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@Controller('purchasing')
@UseGuards(JwtAuthGuard)
export class PurchasingController {
  constructor(private readonly purchasingService: PurchasingService) {}

  @Get('suppliers')
  getSuppliers() {
    return this.purchasingService.getSuppliers();
  }

  @Post('suppliers')
  createSupplier(@Body() dto: CreateSupplierDto) {
    return this.purchasingService.createSupplier(dto);
  }

  @Get('orders')
  getPurchaseOrders() {
    return this.purchasingService.getPurchaseOrders();
  }

  @Get('orders/:id')
  getPurchaseOrderById(@Param('id') id: string) {
    return this.purchasingService.getPurchaseOrderById(+id);
  }

  @Post('orders')
  createPurchaseOrder(@Body() dto: CreatePurchaseOrderDto, @Request() req: any) {
    return this.purchasingService.createPurchaseOrder(dto, req.user.userId);
  }

  @Post('orders/:id/receive')
  receivePurchaseOrder(@Param('id') id: string, @Request() req: any) {
    return this.purchasingService.receivePurchaseOrder(+id, req.user.userId);
  }
}
