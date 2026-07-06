import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CreateVariantDto } from './create-variant.dto';

/**
 * UpdateProductDto - Defines the structure for updating a product
 *
 * This DTO extends CreateProductDto using PartialType:
 * - All fields from CreateProductDto become optional
 * - Allows updating only specific fields without sending all data
 *
 * Example usage:
 * - PATCH /products/123 with { price: 39.99 } - updates only price
 * - PATCH /products/123 with { variants: [...] } - updates variants
 *
 * Why use PartialType?
 * - Prevents sending all fields when updating just one
 * - Makes partial updates cleaner and more flexible
 * - Reduces payload size for updates
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ example: 'Summer Floral Dress', required: false })
  name?: string;

  @ApiProperty({
    example: 'Beautiful summer dress with floral pattern',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: 49.99, required: false })
  price?: number;

  @ApiProperty({
    example: 'uuid-of-category',
    required: false,
  })
  categoryId?: string;

  @ApiProperty({
    description: 'Array of color variants with images and size stock',
    required: false,
    type: [CreateVariantDto],
  })
  variants?: CreateVariantDto[];
}
