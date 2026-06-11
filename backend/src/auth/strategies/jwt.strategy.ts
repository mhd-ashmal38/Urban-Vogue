import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

/**
 * JwtStrategy - Passport strategy for validating JWT tokens
 *
 * This strategy:
 * - Extracts JWT token from Authorization header
 * - Verifies the token using the secret key
 * - Returns the user if token is valid
 * - Throws error if token is invalid or expired
 *
 * How it works:
 * 1. Client sends request with: Authorization: Bearer <token>
 * 2. ExtractJwt extracts the token from the header
 * 3. Strategy verifies the token signature
 * 4. AuthService.validateUser() fetches the user from database
 * 5. User is attached to the request object
 *
 * Usage:
 * - Applied via @UseGuards(JwtAuthGuard) decorator
 * - Automatically validates token before allowing access
 * - User is available via req.user in controllers
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      // Extract JWT from Authorization header (Bearer token)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Use the same secret as in AuthModule
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key',
    });
  }

  /**
   * Validate the JWT payload and return the user
   * @param payload - Decoded JWT payload (contains user ID and email)
   * @returns The user from database
   *
   * This method is called automatically by Passport after verifying the token
   */
  async validate(payload: any) {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
