import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * UsersService - Handles all user-related business logic
 *
 * This service:
 * - Injects PrismaService to access the database
 * - Provides CRUD operations for users
 * - Handles errors (like user not found)
 *
 * Dependency Injection:
 * - The constructor receives PrismaService automatically
 * - NestJS creates and provides the PrismaService instance
 * - We can use this.prisma to access database methods
 */
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new user
   * @param createUserDto - User data from registration
   * @returns The created user (without password for security)
   */
  async create(createUserDto: CreateUserDto) {
    // Hash the password before storing (we'll add bcrypt later)
    // For now, storing plain text (NOT secure - we'll fix this)
    const user = await this.prisma.user.create({
      data: createUserDto,
    });

    // Remove password from response for security
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Find all users
   * @returns Array of all users (without passwords)
   */
  async findAll() {
    const users = await this.prisma.user.findMany();
    // Remove passwords from all users
    return users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  /**
   * Find a single user by ID
   * @param id - User's UUID
   * @returns The user (without password)
   * @throws NotFoundException if user doesn't exist
   */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Find a user by email (useful for authentication)
   * @param email - User's email address
   * @returns The user (including password for auth verification)
   * @throws NotFoundException if user doesn't exist
   */
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  /**
   * Find a user by reset token (for password reset)
   * @param resetToken - The password reset token
   * @returns The user (including password for auth verification)
   * @returns null if user not found
   */
  async findByResetToken(resetToken: string) {
    const user = await this.prisma.user.findFirst({
      where: { resetToken },
    });

    return user;
  }

  /**
   * Update a user
   * @param id - User's UUID
   * @param updateUserDto - Fields to update
   * @returns The updated user (without password)
   * @throws NotFoundException if user doesn't exist
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    // Check if user exists first
    await this.findOne(id);

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Delete a user
   * @param id - User's UUID
   * @returns The deleted user (without password)
   * @throws NotFoundException if user doesn't exist
   */
  async remove(id: string) {
    // Check if user exists first
    await this.findOne(id);

    const user = await this.prisma.user.delete({
      where: { id },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
