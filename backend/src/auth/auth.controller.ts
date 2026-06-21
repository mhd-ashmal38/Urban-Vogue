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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
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
@ApiTags('auth')
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
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 401, description: 'User already exists' })
  @ApiBody({ type: RegisterDto })
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
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req: AuthRequest) {
    return req.user;
  }

  /**
   * POST /auth/forgot-password
   * Request password reset
   * @param forgotPasswordDto - User's email
   * @returns Success message with reset token (for testing)
   *
   * HTTP Status: 200 OK
   *
   * Example request body:
   * {
   *   "email": "user@example.com"
   * }
   *
   * Example response:
   * {
   *   "message": "Password reset token generated",
   *   "resetToken": "abc123..."
   * }
   *
   * Note: In production, the resetToken would be sent via email
   * and not returned in the response
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiBody({ type: ForgotPasswordDto })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  /**
   * POST /auth/reset-password
   * Reset password with token
   * @param resetPasswordDto - Reset token and new password
   * @returns Success message
   *
   * HTTP Status: 200 OK or 401 Unauthorized
   *
   * Example request body:
   * {
   *   "token": "abc123...",
   *   "password": "NewPassword123"
   * }
   *
   * Example response:
   * {
   *   "message": "Password reset successfully"
   * }
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  @ApiBody({ type: ResetPasswordDto })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  /**
   * POST /auth/refresh
   * Issue a new access token using a valid refresh token
   *
   * Process:
   * 1. Receive the refresh token from client
   * 2. Validate it exists in DB and is not expired
   * 3. Rotate: generate new access token + new refresh token
   * 4. Return both new tokens
   *
   * Token Rotation: every time the refresh token is used, a new one
   * is generated and the old one is invalidated. This means a stolen
   * refresh token can only be used once before it becomes invalid.
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  /**
   * POST /auth/logout
   * Logout a user by invalidating their refresh token in the DB
   *
   * Process:
   * 1. Verify the access token (JwtAuthGuard)
   * 2. Clear the refresh token from DB
   * 3. Client should also delete tokens from local storage
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  logout(@Request() req: AuthRequest) {
    return this.authService.logout(req.user.id);
  }

  /**
   * GET /auth/admin-only
   * Example of an admin-only endpoint
   *
   * This endpoint demonstrates how to use RBAC:
   * - JwtAuthGuard: Verifies the access token
   * - RolesGuard: Checks if user has required role
   * - Roles('ADMIN'): Only users with ADMIN role can access
   *
   * Usage example: Add this pattern to any endpoint that should be admin-only
   */
  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Admin-only endpoint example' })
  @ApiResponse({ status: 200, description: 'Access granted (admin only)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (not admin)' })
  adminOnly(@Request() req: AuthRequest) {
    return {
      message: 'Welcome, admin!',
      user: req.user,
    };
  }
}
