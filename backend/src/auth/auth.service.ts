import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

/**
 * AuthService - Handles authentication logic
 *
 * This service:
 * - Registers new users with password hashing
 * - Logs in users and generates JWT tokens
 * - Uses bcrypt for secure password hashing
 * - Uses JWT for token generation
 *
 * Password Hashing with bcrypt:
 * - bcrypt automatically adds salt (random data) to each hash
 * - This prevents rainbow table attacks
 * - The same password will have different hashes each time
 * - bcrypt.compare() handles the verification
 *
 * JWT (JSON Web Token):
 * - Contains encoded user information (payload)
 * - Signed with JWT_SECRET (from .env)
 * - Client sends this token in Authorization header
 * - Server verifies token to authenticate requests
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  /**
   * Register a new user
   * @param registerDto - User registration data
   * @returns The created user and JWT token
   *
   * Process:
   * 1. Check if user already exists by email
   * 2. Hash the password using bcrypt
   * 3. Create the user in the database
   * 4. Generate a JWT token
   * 5. Return user (without password) and token
   */
  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.usersService
      .findByEmail(registerDto.email)
      .catch(() => null);

    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    // Hash the password (10 salt rounds is standard)
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user with hashed password
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    // Generate both tokens
    const accessToken = this.generateAccessToken(user.id, user.email);
    const { refreshToken, refreshTokenExpiry } =
      await this.generateRefreshToken(user.id);

    return {
      user,
      accessToken,
      refreshToken,
      refreshTokenExpiry,
    };
  }

  /**
   * Login a user
   * @param loginDto - User login credentials
   * @returns The user and JWT token
   *
   * Process:
   * 1. Find user by email
   * 2. Compare password hash using bcrypt
   * 3. Generate JWT token if credentials are valid
   * 4. Return user (without password) and token
   */
  async login(loginDto: LoginDto) {
    // Find user by email
    const user = await this.usersService.findByEmail(loginDto.email);

    // Compare password hash
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Remove password from user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    // Generate both tokens
    const accessToken = this.generateAccessToken(user.id, user.email);
    const { refreshToken, refreshTokenExpiry } =
      await this.generateRefreshToken(user.id);

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
      refreshTokenExpiry,
    };
  }

  /**
   * Generate a JWT token for a user
   * @param userId - User's ID
   * @param email - User's email
   * @returns JWT token string
   *
   * JWT Payload contains:
   * - sub: User ID (subject)
   * - email: User's email
   * - iat: Issued at (automatically added)
   * - exp: Expiration time (automatically added based on JWT_EXPIRES_IN)
   */
  private generateAccessToken(userId: string, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }

  private async generateRefreshToken(
    userId: string,
  ): Promise<{ refreshToken: string; refreshTokenExpiry: Date }> {
    // Generate a random 64-byte hex string as refresh token
    const refreshToken = randomBytes(64).toString('hex');

    // Set expiry to 7 days from now
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

    // Save the refresh token in the database
    await this.usersService.update(userId, {
      refreshToken,
      refreshTokenExpiry,
    });

    return { refreshToken, refreshTokenExpiry };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    // Find user by refresh token
    const user = await this.usersService.findByRefreshToken(
      refreshTokenDto.refreshToken,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if token is expired
    if (user.refreshTokenExpiry && user.refreshTokenExpiry < new Date()) {
      // Clear the expired token
      await this.usersService.update(user.id, {
        refreshToken: null,
        refreshTokenExpiry: null,
      });
      throw new UnauthorizedException(
        'Refresh token has expired, please log in again',
      );
    }

    // Rotate: generate new access token + new refresh token (token rotation)
    const accessToken = this.generateAccessToken(user.id, user.email);
    const { refreshToken, refreshTokenExpiry } =
      await this.generateRefreshToken(user.id);

    return { accessToken, refreshToken, refreshTokenExpiry };
  }

  async logout(userId: string) {
    // Invalidate the refresh token by clearing it from the database
    await this.usersService.update(userId, {
      refreshToken: null,
      refreshTokenExpiry: null,
    });

    return { message: 'Logged out successfully' };
  }

  /**
   * Validate a user by JWT payload
   * This is used by the JWT strategy for protected routes
   * @param payload - Decoded JWT payload
   * @returns The user without password
   */
  async validateUser(payload: any) {
    try {
      const user = await this.usersService.findOne(payload.sub as string);
      return user;
    } catch (error) {
      console.error('Error validating user:', error);
      return null;
    }
  }

  /**
   * Request password reset
   * @param forgotPasswordDto - Email of user requesting reset
   * @returns Success message
   *
   * Process:
   * 1. Find user by email
   * 2. Generate random reset token
   * 3. Set expiry to 1 hour from now
   * 4. Save token to user record
   * 5. Send email with reset link
   *
   * Note: The reset token is sent via email, not returned in response
   * for security. User must check their email to get the reset link.
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);

    if (!user) {
      // Don't reveal if email exists (security best practice)
      return {
        message:
          'If an account with this email exists, a reset link has been sent.',
      };
    }

    // Generate random reset token
    const resetToken = randomBytes(32).toString('hex');

    // Set expiry to 1 hour from now
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

    // Save token to user record
    await this.usersService.update(user.id, {
      resetToken,
      resetTokenExpiry,
    });

    // Send email with reset link
    await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return {
      message:
        'If an account with this email exists, a reset link has been sent.',
    };
  }

  /**
   * Reset password with token
   * @param resetPasswordDto - Token and new password
   * @returns Success message
   *
   * Process:
   * 1. Find user by reset token
   * 2. Check if token is expired
   * 3. Hash new password
   * 4. Update user password
   * 5. Clear reset token
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // Find user by reset token
    const user = await this.usersService.findByResetToken(
      resetPasswordDto.token,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // Check if token is expired
    if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
      throw new UnauthorizedException('Reset token has expired');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);

    // Update password and clear reset token
    await this.usersService.update(user.id, {
      password: hashedPassword,
      resetToken: undefined,
      resetTokenExpiry: undefined,
    });

    return {
      message: 'Password reset successfully',
    };
  }
}
