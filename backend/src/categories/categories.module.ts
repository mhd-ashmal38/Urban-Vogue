import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

/**
 * CategoriesModule - Bundles all category-related functionality
 *
 * This module:
 * - Declares CategoriesController (handles HTTP requests)
 * - Provides CategoriesService (business logic)
 * - Makes CategoriesService available to other modules that import this one
 *
 * Module structure:
 * - controllers: Array of controllers that belong to this module
 * - providers: Array of services that this module provides
 * - exports: Services that can be used by other modules
 *
 * Why export CategoriesService?
 * - The Products module will need to fetch categories
 * - By exporting CategoriesService, ProductsModule can inject it
 * - This promotes code reuse across modules
 */
@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
