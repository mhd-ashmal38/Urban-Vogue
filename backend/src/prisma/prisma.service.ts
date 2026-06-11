import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService - A wrapper around Prisma Client for database operations
 *
 * This service:
 * - Extends PrismaClient to get all database methods (user.findMany, etc.)
 * - Implements OnModuleInit to connect to database when module starts
 * - Implements OnModuleDestroy to disconnect when module shuts down
 * - Is marked as @Injectable so it can be used throughout the app
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * Called when the module containing this service is initialized
   * This connects to the database
   */
  async onModuleInit() {
    await this.$connect();
    console.log('Database connected successfully');
  }

  /**
   * Called when the module is destroyed (app shutdown)
   * This disconnects from the database to prevent connection leaks
   */
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Database disconnected');
  }
}
