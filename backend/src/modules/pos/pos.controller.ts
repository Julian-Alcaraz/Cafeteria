import { Controller, Get, Post, Param, Body, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { PosService } from './pos.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('pos')
export class PosController {
  constructor(private readonly posService: PosService) {}

  @Get('accounts')
  getOpenAccounts() {
    return this.posService.getOpenAccounts();
  }

  @Get('sales')
  getSalesHistory() {
    return this.posService.getSalesHistory();
  }

  @Get('accounts/:id')
  getAccountById(@Param('id') id: number) {
    return this.posService.getAccountById(id);
  }

  @Post('accounts')
  openAccount(@Body() dto: { customerName?: string; tableId?: number }, @Request() req: any) {
    return this.posService.openAccount(dto, req.user?.userId || req.user?.id);
  }

  @Post('accounts/:id/items')
  addItem(
    @Param('id') accountId: number,
    @Body() dto: { productId: number; quantity: number; price: number; hopperId?: number }
  ) {
    return this.posService.addItem(accountId, dto);
  }

  @Delete('items/:itemId')
  removeItem(@Param('itemId') itemId: number) {
    return this.posService.removeItem(itemId);
  }

  @Patch('items/:itemId/deliver')
  deliverItem(@Param('itemId') itemId: number, @Request() req: any) {
    return this.posService.deliverItem(itemId, req.user?.userId || req.user?.id);
  }

  @Patch('items/:itemId/remake')
  remakeItem(@Param('itemId') itemId: number, @Request() req: any, @Body() dto: { reason?: string }) {
    return this.posService.remakeItem(itemId, req.user?.userId || req.user?.id, dto?.reason);
  }

  @Patch('accounts/:id/close')
  closeAccount(@Param('id') accountId: number, @Body() dto: { paymentMethodInfo?: string; tip?: number }, @Request() req: any) {
    return this.posService.closeAccount(accountId, dto, req.user?.userId || req.user?.id);
  }
}
