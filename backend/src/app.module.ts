import { Module } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';

/**
 * AppModule - The root module of the application
 *
 * This module:
 * - Imports all feature modules (Prisma, Users, Auth)
 * - Configures global validation pipe
 * - Bootstraps the application
 *
 * Global Validation Pipe:
 * - Automatically validates all DTOs
 * - Strips unknown properties (security feature)
 * - Transform types (e.g., string to number)
 * - Applied globally so every endpoint benefits from validation
 */
@Module({
  imports: [PrismaModule, UsersModule, AuthModule, CategoriesModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // Strip properties that don't have decorators
        transform: true, // Transform types automatically
      }),
    },
  ],
})
export class AppModule {}
