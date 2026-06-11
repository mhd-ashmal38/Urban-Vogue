import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * PrismaModule - Provides database access to the entire application
 *
 * This module:
 * - Is marked with @Global() so it doesn't need to be imported in every module
 * - Provides PrismaService as a singleton (one instance shared across the app)
 * - Can be imported anywhere to access the database
 *
 * @Global decorator explanation:
 * - Without @Global, each module would need to import PrismaModule
 * - With @Global, PrismaService is available in ALL modules automatically
 * - This is appropriate for Prisma since it's a core infrastructure service
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
