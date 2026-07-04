import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * UpdateProductDto - Defines the structure for updating a product
 *
 * This DTO extends CreateProductDto using PartialType:
 * - All fields from CreateProductDto become optional
 * - Allows updating only specific fields without sending all data
 *
 * Example usage:
 * - PATCH /products/123 with { price: 899.99 } - updates only price
 * - PATCH /products/123 with { stock: 100 } - updates only stock
 *
 * Why use PartialType?
 * - Prevents sending all fields when updating just one
 * - Makes partial updates cleaner and more flexible
 * - Reduces payload size for updates
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ example: 'iPhone 15 Pro', required: false })
  name?: string;

  @ApiProperty({
    example: 'Latest iPhone with A17 Pro chip',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: 999.99, required: false })
  price?: number;

  @ApiProperty({ example: 50, required: false })
  stock?: number;

  @ApiProperty({
    example: 'uuid-of-category',
    required: false,
  })
  categoryId?: string;

  @ApiProperty({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    required: false,
    type: [String],
  })
  images?: string[];

  @ApiProperty({
    example: ['S', 'M', 'L', 'XL'],
    required: false,
    type: [String],
  })
  sizes?: string[];

  @ApiProperty({
    example: ['Red', 'Blue', 'Black'],
    required: false,
    type: [String],
  })
  colors?: string[];
}
