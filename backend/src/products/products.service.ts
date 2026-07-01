import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import * as fs from 'fs';
import * as path from 'path';

/**
 * ProductsService - Handles all product-related business logic
 *
 * This service:
 * - Injects PrismaService to access the database
 * - Provides CRUD operations for products
 * - Handles errors (like product not found)
 * - Includes category relationship handling
 *
 * Dependency Injection:
 * - The constructor receives PrismaService automatically
 * - NestJS creates and provides the PrismaService instance
 * - We can use this.prisma to access database methods
 */
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new product
   * @param createProductDto - Product data
   * @returns The created product with category
   */
  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: createProductDto,
      include: {
        category: true, // Include category in response
      },
    });

    return product;
  }

  /**
   * Find all products
   * @param categoryId - Optional filter by category ID
   * @returns Array of all products with categories
   */
  async findAll(categoryId?: string) {
    const products = await this.prisma.product.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: {
        category: true, // Include category in response
      },
      orderBy: { createdAt: 'desc' }, // Sort by newest first
    });

    return products;
  }

  /**
   * Find a single product by ID
   * @param id - Product's UUID
   * @returns The product with category
   * @throws NotFoundException if product doesn't exist
   */
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true, // Include category in response
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  /**
   * Find products by category ID
   * @param categoryId - Category's UUID
   * @returns Array of products in the category
   */
  async findByCategory(categoryId: string) {
    const products = await this.prisma.product.findMany({
      where: { categoryId },
      include: {
        category: true,
      },
      orderBy: { name: 'asc' }, // Sort alphabetically by name
    });

    return products;
  }

  /**
   * Search products by name
   * @param query - Search query string
   * @returns Array of matching products
   */
  async search(query: string) {
    const products = await this.prisma.product.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive', // Case-insensitive search
        },
      },
      include: {
        category: true,
      },
    });

    return products;
  }

  /**
   * Update a product
   * @param id - Product's UUID
   * @param updateProductDto - Fields to update
   * @returns The updated product with category
   * @throws NotFoundException if product doesn't exist
   */
  async update(id: string, updateProductDto: UpdateProductDto) {
    // Check if product exists first
    await this.findOne(id);

    const product = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        category: true,
      },
    });

    return product;
  }

  /**
   * Delete a product
   * @param id - Product's UUID
   * @returns The deleted product
   * @throws NotFoundException if product doesn't exist
   */
  async remove(id: string) {
    // Check if product exists first
    await this.findOne(id);

    const product = await this.prisma.product.delete({
      where: { id },
      include: {
        category: true,
      },
    });

    return product;
  }

  /**
   * Delete multiple products at once
   * @param ids - Array of product UUIDs to delete
   * @returns Count of deleted products
   */
  async bulkRemove(ids: string[]) {
    const result = await this.prisma.product.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return {
      count: result.count,
    };
  }

  /**
   * Delete an individual image file
   * @param imageUrl - The URL of the image to delete
   * @returns Success message
   */
  deleteImage(imageUrl: string) {
    // Extract filename from URL
    const filename = imageUrl.split('/').pop();

    if (!filename) {
      throw new Error('Invalid image URL');
    }

    const filePath = path.join(process.cwd(), 'uploads', filename);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return {
        message: 'Image deleted successfully',
        filename,
      };
    }

    throw new Error('Image file not found');
  }
}
