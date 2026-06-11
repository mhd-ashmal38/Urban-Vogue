import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

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

    // Generate JWT token
    const token = this.generateToken(user.id, user.email);

    return {
      user,
      token,
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

    // Generate JWT token
    const token = this.generateToken(user.id, user.email);

    return {
      user: userWithoutPassword,
      token,
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
  private generateToken(userId: string, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }

  /**
   * Validate a user by JWT payload
   * This is used by the JWT strategy for protected routes
   * @param payload - Decoded JWT payload
   * @returns The user without password
   */
  async validateUser(payload: any) {
    const user = await this.usersService.findOne(payload.sub);
    return user;
  }
}
