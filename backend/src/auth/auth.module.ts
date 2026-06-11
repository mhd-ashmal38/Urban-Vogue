import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

/**
 * AuthModule - Bundles all authentication functionality
 *
 * This module:
 * - Declares AuthController (handles HTTP requests)
 * - Provides AuthService (authentication logic)
 * - Imports UsersModule (to create users during registration)
 * - Configures JwtModule for token generation
 *
 * Module structure:
 * - imports: Other modules this module depends on
 * - controllers: Controllers that belong to this module
 * - providers: Services that this module provides
 *
 * Why import UsersModule?
 * - AuthService needs to create users during registration
 * - By importing UsersModule, AuthService can inject UsersService
 *
 * Why configure JwtModule?
 * - AuthService needs to generate JWT tokens
 * - JwtModule needs configuration (secret, expiration time)
 * - These values come from environment variables
 */
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as any,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
