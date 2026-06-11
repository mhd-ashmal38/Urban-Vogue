import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthRequest } from '../common/types';

/**
 * AuthController - Handles HTTP requests for authentication
 *
 * This controller:
 * - Provides registration endpoint
 * - Provides login endpoint
 * - Returns JWT tokens for authenticated users
 *
 * Route prefix: 'auth' (from @Controller decorator)
 * All routes will be prefixed with /auth
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/register
   * Register a new user
   * @param registerDto - User registration data
   * @returns The created user and JWT token
   *
   * HTTP Status: 201 Created
   *
   * Example request body:
   * {
   *   "email": "user@example.com",
   *   "password": "password123",
   *   "name": "John Doe"
   * }
   *
   * Example response:
   * {
   *   "user": {
   *     "id": "uuid",
   *     "email": "user@example.com",
   *     "name": "John Doe",
   *     "isActive": true,
   *     "createdAt": "2024-01-01T00:00:00.000Z",
   *     "updatedAt": "2024-01-01T00:00:00.000Z"
   *   },
   *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * POST /auth/login
   * Login a user
   * @param loginDto - User login credentials
   * @returns The user and JWT token
   *
   * HTTP Status: 200 OK
   *
   * Example request body:
   * {
   *   "email": "user@example.com",
   *   "password": "password123"
   * }
   *
   * Example response:
   * {
   *   "user": {
   *     "id": "uuid",
   *     "email": "user@example.com",
   *     "name": "John Doe",
   *     "isActive": true,
   *     "createdAt": "2024-01-01T00:00:00.000Z",
   *     "updatedAt": "2024-01-01T00:00:00.000Z"
   *   },
   *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * GET /auth/profile
   * Get current user profile (protected route)
   * @param req - Request object with authenticated user
   * @returns The authenticated user
   *
   * HTTP Status: 200 OK or 401 Unauthorized
   *
   * This route is protected by JwtAuthGuard:
   * - Client must send: Authorization: Bearer <token>
   * - Token is validated by JwtStrategy
   * - User is attached to req.user
   *
   * Example request:
   * GET /auth/profile
   * Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *
   * Example response:
   * {
   *   "id": "uuid",
   *   "email": "user@example.com",
   *   "name": "John Doe",
   *   "isActive": true,
   *   "createdAt": "2024-01-01T00:00:00.000Z",
   *   "updatedAt": "2024-01-01T00:00:00.000Z"
   * }
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: AuthRequest) {
    return req.user;
  }
}
