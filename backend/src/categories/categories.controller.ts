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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

/**
 * CategoriesController - Handles HTTP requests for category operations
 *
 * This controller:
 * - Defines the API endpoints for categories
 * - Uses decorators to map HTTP methods to functions
 * - Validates request bodies using DTOs
 * - Calls CategoriesService for business logic
 * - Applies RBAC for admin-only operations
 *
 * Route prefix: 'categories' (from @Controller decorator)
 * All routes will be prefixed with /categories
 *
 * RBAC Strategy:
 * - GET endpoints: Public (no authentication required)
 * - POST/PATCH/DELETE: Admin only (requires JWT + ADMIN role)
 */
@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * POST /categories
   * Create a new category (admin only)
   * @param createCategoryDto - Category data
   * @returns The created category
   *
   * HTTP Status: 201 Created or 401 Unauthorized or 403 Forbidden
   *
   * RBAC: Requires ADMIN role
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new category (admin only)' })
  @ApiResponse({ status: 201, description: 'Category successfully created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiBody({ type: CreateCategoryDto })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  /**
   * GET /categories
   * Get all categories (public)
   * @returns Array of all categories
   *
   * HTTP Status: 200 OK
   *
   * RBAC: Public - no authentication required
   */
  @Get()
  @ApiOperation({ summary: 'Get all categories (public)' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  /**
   * GET /categories/:id
   * Get a specific category by ID (public)
   * @param id - Category's UUID from URL parameter
   * @returns The category with its products
   *
   * HTTP Status: 200 OK or 404 Not Found
   *
   * RBAC: Public - no authentication required
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID (public)' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  /**
   * PATCH /categories/:id
   * Update a category (admin only)
   * @param id - Category's UUID from URL parameter
   * @param updateCategoryDto - Fields to update
   * @returns The updated category
   *
   * HTTP Status: 200 OK or 404 Not Found or 401 Unauthorized or 403 Forbidden
   *
   * RBAC: Requires ADMIN role
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a category (admin only)' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiBody({ type: UpdateCategoryDto })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  /**
   * DELETE /categories/bulk-delete
   * Delete multiple categories at once (admin only)
   * @param ids - Array of category UUIDs to delete
   * @returns Success message and count of deleted categories
   *
   * HTTP Status: 200 OK or 401 Unauthorized or 403 Forbidden
   *
   * RBAC: Requires ADMIN role
   *
   * Note: Due to ON DELETE CASCADE in the schema,
   * deleting categories will also delete all their products
   */
  @Delete('bulk-delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete multiple categories (admin only)' })
  @ApiResponse({ status: 200, description: 'Categories deleted successfully' })
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
    const result = await this.categoriesService.bulkRemove(ids);
    return {
      message: `${result.count} categories deleted successfully`,
      count: result.count,
    };
  }

  /**
   * DELETE /categories/:id
   * Delete a category (admin only)
   * @param id - Category's UUID from URL parameter
   * @returns Success message and deleted category
   *
   * HTTP Status: 200 OK or 404 Not Found or 401 Unauthorized or 403 Forbidden
   *
   * RBAC: Requires ADMIN role
   *
   * Note: Due to ON DELETE CASCADE in the schema,
   * deleting a category will also delete all its products
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a category (admin only)' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async remove(@Param('id') id: string) {
    const category = await this.categoriesService.remove(id);
    return {
      message: 'Category deleted successfully',
      category,
    };
  }
}
