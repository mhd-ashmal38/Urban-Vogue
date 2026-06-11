import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard - Guard to protect routes with JWT authentication
 *
 * This guard:
 * - Uses the JWT strategy to validate tokens
 * - Protects routes from unauthenticated access
 * - Attaches the authenticated user to req.user
 *
 * How to use:
 * - Add @UseGuards(JwtAuthGuard) decorator to controller methods
 * - Client must send: Authorization: Bearer <token>
 * - If token is valid, request proceeds
 * - If token is invalid/missing, returns 401 Unauthorized
 *
 * Example:
 * @Get('profile')
 * @UseGuards(JwtAuthGuard)
 * getProfile(@Request() req) {
 *   return req.user; // The authenticated user
 * }
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
