import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

/**
 * CategoriesService - Handles all category-related business logic
 *
 * This service:
 * - Injects PrismaService to access the database
 * - Provides CRUD operations for categories
 * - Handles errors (like category not found)
 *
 * Dependency Injection:
 * - The constructor receives PrismaService automatically
 * - NestJS creates and provides the PrismaService instance
 * - We can use this.prisma to access database methods
 */
@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new category
   * @param createCategoryDto - Category data
   * @returns The created category
   */
  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: createCategoryDto,
    });

    return category;
  }

  /**
   * Find all categories
   * @returns Array of all categories
   */
  async findAll() {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' }, // Sort alphabetically by name
    });

    return categories;
  }

  /**
   * Find a single category by ID
   * @param id - Category's UUID
   * @returns The category
   * @throws NotFoundException if category doesn't exist
   */
  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: true, // Include related products
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  /**
   * Find a category by name
   * @param name - Category name
   * @returns The category
   * @returns null if category not found
   */
  async findByName(name: string) {
    const category = await this.prisma.category.findUnique({
      where: { name },
    });

    return category;
  }

  /**
   * Update a category
   * @param id - Category's UUID
   * @param updateCategoryDto - Fields to update
   * @returns The updated category
   * @throws NotFoundException if category doesn't exist
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    // Check if category exists first
    await this.findOne(id);

    const category = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });

    return category;
  }

  /**
   * Delete a category
   * @param id - Category's UUID
   * @returns The deleted category
   * @throws NotFoundException if category doesn't exist
   *
   * Note: Due to ON DELETE CASCADE in the schema,
   * deleting a category will also delete all its products
   */
  async remove(id: string) {
    // Check if category exists first
    await this.findOne(id);

    const category = await this.prisma.category.delete({
      where: { id },
    });

    return category;
  }

  /**
   * Delete multiple categories at once
   * @param ids - Array of category UUIDs to delete
   * @returns Count of deleted categories
   *
   * Note: Due to ON DELETE CASCADE in the schema,
   * deleting categories will also delete all their products
   */
  async bulkRemove(ids: string[]) {
    const result = await this.prisma.category.deleteMany({
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
}
