import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * UpdateCategoryDto - Defines the structure for updating a category
 *
 * This DTO extends CreateCategoryDto using PartialType:
 * - All fields from CreateCategoryDto become optional
 * - Allows updating only specific fields without sending all data
 *
 * Example usage:
 * - PATCH /categories/123 with { name: "New Name" } - updates only name
 * - PATCH /categories/123 with { description: "New description" } - updates only description
 *
 * Why use PartialType?
 * - Prevents sending all fields when updating just one
 * - Makes partial updates cleaner and more flexible
 * - Reduces payload size for updates
 */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({ example: 'Electronics', required: false })
  name?: string;

  @ApiProperty({
    example: 'Electronic devices and accessories',
    required: false,
  })
  description?: string;
}
