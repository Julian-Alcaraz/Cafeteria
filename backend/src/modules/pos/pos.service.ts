import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { Account } from './entities/account.entity.js';
import { AccountItem } from './entities/account-item.entity.js';
import { InventoryService } from '../inventory/inventory.service.js';
import { RecipesService } from '../recipes/recipes.service.js';
import { Product } from '../catalog/entities/product.entity.js';
import { AccountStatus } from './enums/account-status.enum.js';
import { AccountItemStatus } from './enums/account-item-status.enum.js';
import { StockMovementType, ReferenceType } from '../inventory/entities/stock-movement.entity.js';

@Injectable()
export class PosService {
  private readonly logger = new Logger(PosService.name);

  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(AccountItem)
    private readonly accountItemRepo: Repository<AccountItem>,
    private readonly inventoryService: InventoryService,
    private readonly recipesService: RecipesService,
    private readonly dataSource: DataSource,
  ) {}

  // ==========================================
  // ACCOUNTS
  // ==========================================

  async getOpenAccounts() {
    return this.accountRepo.find({
      where: { status: AccountStatus.OPEN, deshabilitado: false },
      relations: { items: { product: true, hopper: true }, user: true },
      order: { id: 'DESC' },
    });
  }

  async getSalesHistory() {
    return this.accountRepo.find({
      where: { status: AccountStatus.CLOSED, deshabilitado: false },
      relations: { items: { product: true }, user: true },
      order: { updatedAt: 'DESC' },
      take: 100, // Limit to 100 recent sales for now
    });
  }

  async getAccountById(id: number) {
    const account = await this.accountRepo.findOne({
      where: { id, deshabilitado: false },
      relations: { items: { product: true, hopper: true } },
    });
    if (!account) throw new NotFoundException('Account not found');
    return account;
  }

  async openAccount(dto: { customerName?: string; tableId?: number }, userId?: number) {
    const account = this.accountRepo.create({
      customerName: dto.customerName,
      tableId: dto.tableId,
      userId: userId,
      status: AccountStatus.OPEN,
      totalAmount: 0,
    });
    return this.accountRepo.save(account);
  }

  // ==========================================
  // ITEMS & INVENTORY
  // ==========================================

  async addItem(accountId: number, dto: { productId: number; quantity: number; price: number; hopperId?: number }) {
    const account = await this.getAccountById(accountId);
    if (account.status !== AccountStatus.OPEN) throw new BadRequestException('Account is not open');

    const item = this.accountItemRepo.create({
      accountId,
      productId: dto.productId,
      quantity: dto.quantity,
      price: dto.price,
      status: AccountItemStatus.PENDING,
      hopperId: dto.hopperId,
    });

    // Update account total
    account.totalAmount = Number(account.totalAmount) + Number(dto.price) * Number(dto.quantity);
    await this.accountRepo.save(account);

    return this.accountItemRepo.save(item);
  }

  async removeItem(itemId: number) {
    const item = await this.accountItemRepo.findOne({ where: { id: itemId }, relations: { account: true } });
    if (!item) throw new NotFoundException('Item not found');
    if (item.status !== AccountItemStatus.PENDING) {
      throw new BadRequestException('Solo se pueden eliminar ítems que están en estado PENDING');
    }
    
    const account = item.account;
    await this.accountItemRepo.remove(item);
    
    // Update account total
    const updatedAccount = await this.accountRepo.findOne({ where: { id: account.id }, relations: { items: true } });
    if (updatedAccount) {
      const newTotal = updatedAccount.items.reduce((sum, i) => sum + (Number(i.price) * Number(i.quantity)), 0);
      updatedAccount.totalAmount = newTotal;
      await this.accountRepo.save(updatedAccount);
    }
    
    return { success: true };
  }

  async deliverItem(itemId: number, userId: number) {
    return this.dataSource.transaction(async manager => {
      const item = await manager.findOne(AccountItem, { where: { id: itemId }, relations: { product: true } });
      if (!item) throw new NotFoundException('Item not found');
      if (item.status !== AccountItemStatus.PENDING) throw new BadRequestException('Item already delivered or cancelled');

      // 1. Deduct Stock
      await this.deductItemStock(manager, item, userId, StockMovementType.SALE);

      // 2. Mark Delivered
      item.status = AccountItemStatus.DELIVERED;
      await manager.save(item);

      return item;
    });
  }

  private async deductItemStock(manager: EntityManager, item: AccountItem, userId: number, moveType: StockMovementType) {
    try {
      // Try to find a recipe
      const recipe = await this.recipesService.findActiveByProduct(item.productId);
      
      // If recipe exists, deduct ingredients
      for (const ingredient of recipe.ingredients) {
        let productIdToDeduct = ingredient.productId;
        
        // If it's a hopper slot, we must deduct the coffee bean associated with the hopper
        // (Assuming HopperConfig has productId which refers to the coffee variety product)
        if (ingredient.isHopperSlot) {
          if (!item.hopperId) throw new BadRequestException('Hopper selection required for this recipe');
          // Get the hopper config to find which product is inside
          const hopper = await manager.query('SELECT "productId" FROM hopper_configs WHERE id = $1', [item.hopperId]);
          if (!hopper || hopper.length === 0) throw new BadRequestException('Hopper not found');
          productIdToDeduct = hopper[0].productId;
        }

        const qtyToDeduct = Number(ingredient.quantity) * Number(item.quantity);
        await this.inventoryService.deductStock({
          productId: productIdToDeduct,
          quantity: qtyToDeduct,
          type: moveType,
          referenceType: ReferenceType.ACCOUNT_ITEM,
          referenceId: item.accountId,
        }, userId, manager);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        // No recipe? Deduct the product itself (e.g. bottled water)
        await this.inventoryService.deductStock({
          productId: item.productId,
          quantity: item.quantity,
          type: moveType,
          referenceType: ReferenceType.ACCOUNT_ITEM,
          referenceId: item.accountId,
        }, userId, manager);
      } else {
        throw error;
      }
    }
  }

  async remakeItem(itemId: number, userId: number, reason?: string) {
    return this.dataSource.transaction(async manager => {
      const item = await manager.findOne(AccountItem, { where: { id: itemId }, relations: { product: true } });
      if (!item) throw new NotFoundException('Item not found');
      if (item.status !== AccountItemStatus.DELIVERED) throw new BadRequestException('Item must be delivered to be remade');

      // Deduct stock again as WASTE
      await this.deductItemStock(manager, item, userId, StockMovementType.WASTE);
      
      item.remadeQuantity = Number(item.remadeQuantity) + Number(item.quantity);
      return manager.save(item);
    });
  }

  async closeAccount(accountId: number, dto: { paymentMethodInfo?: string; tip?: number }, userId: number) {
    const account = await this.getAccountById(accountId);
    if (account.status !== AccountStatus.OPEN) throw new BadRequestException('Account is not open');

    // Auto-deliver any pending items
    for (const item of account.items) {
      if (item.status === AccountItemStatus.PENDING) {
        await this.deliverItem(item.id, userId);
      }
    }

    account.status = AccountStatus.CLOSED;
    if (dto.paymentMethodInfo !== undefined) account.paymentMethodInfo = dto.paymentMethodInfo;
    if (dto.tip !== undefined) account.tip = dto.tip;

    return this.accountRepo.save(account);
  }
}

