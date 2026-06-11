import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

/**
 * UsersModule - Bundles all user-related functionality
 *
 * This module:
 * - Declares UsersController (handles HTTP requests)
 * - Provides UsersService (business logic)
 * - Makes UsersService available to other modules that import this one
 *
 * Module structure:
 * - controllers: Array of controllers that belong to this module
 * - providers: Array of services that this module provides
 * - exports: Services that can be used by other modules
 *
 * Why export UsersService?
 * - The Auth module will need to create users during registration
 * - By exporting UsersService, AuthModule can inject it
 * - This promotes code reuse across modules
 */
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
