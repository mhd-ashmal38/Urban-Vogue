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
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { multerConfig } from '../common/config/multer.config';

/**
 * ProductsController - Handles HTTP requests for product operations
 *
 * This controller:
 * - Defines the API endpoints for products
 * - Uses decorators to map HTTP methods to functions
 * - Validates request bodies using DTOs
 * - Calls ProductsService for business logic
 * - Applies RBAC for admin-only operations
 *
 * Route prefix: 'products' (from @Controller decorator)
 * All routes will be prefixed with /products
 *
 * RBAC Strategy:
 * - GET endpoints: Public (no authentication required)
 * - POST/PATCH/DELETE: Admin only (requires JWT + ADMIN role)
 */
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * POST /products
   * Create a new product (admin only)
   * @param createProductDto - Product data
   * @returns The created product with category
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
  @ApiOperation({ summary: 'Create a new product (admin only)' })
  @ApiResponse({ status: 201, description: 'Product successfully created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiBody({ type: CreateProductDto })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  /**
   * GET /products
   * Get all products (public)
   * @param categoryId - Optional filter by category ID
   * @returns Array of all products with categories
   *
   * HTTP Status: 200 OK
   *
   * RBAC: Public - no authentication required
   */
  @Get()
  @ApiOperation({ summary: 'Get all products (public)' })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Filter products by category ID',
  })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  findAll(@Query('categoryId') categoryId?: string) {
    return this.productsService.findAll(categoryId);
  }

  /**
   * GET /products/search
   * Search products by name (public)
   * @param query - Search query string
   * @returns Array of matching products
   *
   * HTTP Status: 200 OK
   *
   * RBAC: Public - no authentication required
   */
  @Get('search')
  @ApiOperation({ summary: 'Search products by name (public)' })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Search query string',
  })
  @ApiResponse({ status: 200, description: 'Search results' })
  search(@Query('q') query: string) {
    return this.productsService.search(query);
  }

  /**
   * GET /products/:id
   * Get a specific product by ID (public)
   * @param id - Product's UUID from URL parameter
   * @returns The product with category
   *
   * HTTP Status: 200 OK or 404 Not Found
   *
   * RBAC: Public - no authentication required
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID (public)' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  /**
   * PATCH /products/:id
   * Update a product (admin only)
   * @param id - Product's UUID from URL parameter
   * @param updateProductDto - Fields to update
   * @returns The updated product with category
   *
   * HTTP Status: 200 OK or 404 Not Found or 401 Unauthorized or 403 Forbidden
   *
   * RBAC: Requires ADMIN role
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a product (admin only)' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiBody({ type: UpdateProductDto })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  /**
   * DELETE /products/delete-image
   * Delete an individual image file (admin only)
   * @param imageUrl - The URL of the image to delete
   * @returns Success message
   *
   * HTTP Status: 200 OK or 400 Bad Request or 401 Unauthorized or 403 Forbidden
   *
   * RBAC: Requires ADMIN role
   */
  @Delete('delete-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete an individual image file (admin only)' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid image URL or file not found',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  deleteImage(@Body('imageUrl') imageUrl: string) {
    return this.productsService.deleteImage(imageUrl);
  }

  /**
   * DELETE /products/bulk-delete
   * Delete multiple products at once (admin only)
   * @param ids - Array of product UUIDs to delete
   * @returns Success message and count of deleted products
   *
   * HTTP Status: 200 OK or 401 Unauthorized or 403 Forbidden
   *
   * RBAC: Requires ADMIN role
   */
  @Delete('bulk-delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete multiple products (admin only)' })
  @ApiResponse({ status: 200, description: 'Products deleted successfully' })
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
    const result = await this.productsService.bulkRemove(ids);
    return {
      message: `${result.count} products deleted successfully`,
      count: result.count,
    };
  }

  /**
   * DELETE /products/:id
   * Delete a product (admin only)
   * @param id - Product's UUID from URL parameter
   * @returns Success message and deleted product
   *
   * HTTP Status: 200 OK or 404 Not Found or 401 Unauthorized or 403 Forbidden
   *
   * RBAC: Requires ADMIN role
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a product (admin only)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async remove(@Param('id') id: string) {
    const product = await this.productsService.remove(id);
    return {
      message: 'Product deleted successfully',
      product,
    };
  }

  /**
   * POST /products/upload
   * Upload product images (admin only)
   * @param files - Array of image files (max 5)
   * @returns Array of uploaded image URLs
   *
   * HTTP Status: 201 Created or 400 Bad Request or 401 Unauthorized or 403 Forbidden
   *
   * RBAC: Requires ADMIN role
   *
   * File constraints:
   * - Max 5 files per request
   * - Only image files (jpg, jpeg, png, gif, webp)
   * - Max 5MB per file
   */
  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FilesInterceptor('images', 5, multerConfig))
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload product images (admin only)' })
  @ApiResponse({ status: 201, description: 'Images uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file or too many files' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    // Generate URLs for uploaded files
    const imageUrls = files.map((file) => {
      return `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/${file.filename}`;
    });

    return {
      message: 'Images uploaded successfully',
      images: imageUrls,
    };
  }
}
