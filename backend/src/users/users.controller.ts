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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

/**
 * UsersController - Handles HTTP requests for user operations
 *
 * This controller:
 * - Defines the API endpoints for users
 * - Uses decorators to map HTTP methods to functions
 * - Validates request bodies using DTOs
 * - Calls UsersService for business logic
 * - Applies RBAC for admin-only operations
 *
 * Route prefix: 'users' (from @Controller decorator)
 * All routes will be prefixed with /users
 *
 * RBAC Strategy:
 * - POST /users: Public (registration)
 * - GET /users: Admin only
 * - GET /users/:id: Admin only
 * - PATCH /users/:id: Admin only
 * - DELETE /users/:id: Admin only
 * - DELETE /users/bulk-delete: Admin only
 */
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /users
   * Create a new user (public - registration)
   * @param createUserDto - User registration data
   * @returns The created user
   *
   * HTTP Status: 201 Created
   *
   * RBAC: Public - no authentication required
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user (registration)' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * GET /users
   * Get all users (admin only)
   * @returns Array of all users
   *
   * HTTP Status: 200 OK or 401 Unauthorized or 403 Forbidden
   *
   * RBAC: Requires ADMIN role
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * GET /users/:id
   * Get a specific user by ID (admin only)
   * @param id - User's UUID from URL parameter
   * @returns The user
   *
   * HTTP Status: 200 OK or 404 Not Found or 401 Unauthorized or 403 Forbidden
   *
   * RBAC: Requires ADMIN role
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a user by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * PATCH /users/:id
   * Update a user (admin only)
   * @param id - User's UUID from URL parameter
   * @param updateUserDto - Fields to update (name, email, role, isActive)
   * @returns The updated user
   *
   * HTTP Status: 200 OK or 404 Not Found or 401 Unauthorized or 403 Forbidden
   *
   * RBAC: Requires ADMIN role
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a user (admin only)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiBody({ type: UpdateUserDto })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * DELETE /users/bulk-delete
   * Delete multiple users at once (admin only)
   * @param ids - Array of user UUIDs to delete
   * @returns Success message and count of deleted users
   *
   * HTTP Status: 200 OK or 401 Unauthorized or 403 Forbidden
   *
   * RBAC: Requires ADMIN role
   */
  @Delete('bulk-delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete multiple users (admin only)' })
  @ApiResponse({ status: 200, description: 'Users deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  })
  async bulkRemove(@Body('ids') ids: string[]) {
    const result = await this.usersService.bulkRemove(ids);
    return {
      message: `${result.count} users deleted successfully`,
      count: result.count,
    };
  }

  /**
   * DELETE /users/:id
   * Delete a user (admin only)
   * @param id - User's UUID from URL parameter
   * @returns The deleted user
   *
   * HTTP Status: 200 OK or 404 Not Found or 401 Unauthorized or 403 Forbidden
   *
   * RBAC: Requires ADMIN role
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a user (admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async remove(@Param('id') id: string) {
    const user = await this.usersService.remove(id);
    return {
      message: 'User deleted successfully',
      user,
    };
  }
}
