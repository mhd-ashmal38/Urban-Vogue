import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * UsersController - Handles HTTP requests for user operations
 *
 * This controller:
 * - Defines the API endpoints for users
 * - Uses decorators to map HTTP methods to functions
 * - Validates request bodies using DTOs
 * - Calls UsersService for business logic
 *
 * Route prefix: 'users' (from @Controller decorator)
 * All routes will be prefixed with /users
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /users
   * Create a new user
   * @param createUserDto - User registration data
   * @returns The created user
   *
   * HTTP Status: 201 Created
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * GET /users
   * Get all users
   * @returns Array of all users
   *
   * HTTP Status: 200 OK
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * GET /users/:id
   * Get a specific user by ID
   * @param id - User's UUID from URL parameter
   * @returns The user
   *
   * HTTP Status: 200 OK or 404 Not Found
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * PATCH /users/:id
   * Update a user
   * @param id - User's UUID from URL parameter
   * @param updateUserDto - Fields to update
   * @returns The updated user
   *
   * HTTP Status: 200 OK or 404 Not Found
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * DELETE /users/:id
   * Delete a user
   * @param id - User's UUID from URL parameter
   * @returns The deleted user
   *
   * HTTP Status: 200 OK or 404 Not Found
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
