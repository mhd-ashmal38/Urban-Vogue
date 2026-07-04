import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CategoriesModule } from '../categories/categories.module';

/**
 * ProductsModule - Bundles all product-related functionality
 *
 * This module:
 * - Declares ProductsController (handles HTTP requests)
 * - Provides ProductsService (business logic)
 * - Imports CategoriesModule to access category data
 * - Makes ProductsService available to other modules that import this one
 *
 * Module structure:
 * - imports: Modules this module depends on (CategoriesModule)
 * - controllers: Array of controllers that belong to this module
 * - providers: Array of services that this module provides
 * - exports: Services that can be used by other modules
 *
 * Why import CategoriesModule?
 * - Products need to fetch their associated category
 * - ProductsService can inject CategoriesService
 * - This allows including category data in product responses
 *
 * Why export ProductsService?
 * - The Orders module will need to fetch products
 * - By exporting ProductsService, OrdersModule can inject it
 * - This promotes code reuse across modules
 */
@Module({
  imports: [CategoriesModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
