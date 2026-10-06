import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogService } from './catalog.service.js';
import { CatalogController } from './catalog.controller.js';
import { Product } from './entities/product.entity.js';
import { ProductType } from './entities/product-type.entity.js';
import { Category } from './entities/category.entity.js';
import { CoffeeVariety } from './entities/coffee-variety.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductType, Category, CoffeeVariety]),
    AuthModule,
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}
