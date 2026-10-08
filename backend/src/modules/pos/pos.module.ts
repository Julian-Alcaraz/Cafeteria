import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PosController } from './pos.controller.js';
import { PosService } from './pos.service.js';
import { Account } from './entities/account.entity.js';
import { AccountItem } from './entities/account-item.entity.js';
import { InventoryModule } from '../inventory/inventory.module.js';
import { RecipesModule } from '../recipes/recipes.module.js';
import { HoppersModule } from '../hoppers/hoppers.module.js';
import { CatalogModule } from '../catalog/catalog.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, AccountItem]),
    InventoryModule,
    RecipesModule,
    HoppersModule,
    CatalogModule,
  ],
  controllers: [PosController],
  providers: [PosService],
  exports: [PosService],
})
export class PosModule {}
