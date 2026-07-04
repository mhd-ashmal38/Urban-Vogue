import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * CreateProductDto - Defines the structure for creating a new product
 *
 * This DTO validates product creation data:
 * - name: Required, must be at least 2 characters
 * - description: Optional
 * - price: Required, must be a positive number
 * - stock: Required, must be a non-negative integer
 * - categoryId: Required, must reference an existing category
 * - images: Optional array of image URLs
 *
 * Validation decorators from class-validator:
 * - @IsString() - Ensures the field is a string
 * - @IsOptional() - Field can be omitted
 * - @IsArray() - Ensures the field is an array
 * - @IsNumber() - Ensures the field is a number
 * - @Min() - Ensures the number is at least the specified value
 * - @IsNotEmpty() - Ensures the field is not empty
 *
 * ApiProperty decorators for Swagger documentation:
 * - @ApiProperty() - Describes the field in API docs
 */
export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro', description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Latest iPhone with A17 Pro chip',
    description: 'Product description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 999.99, description: 'Product price' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({ example: 50, description: 'Number of items in stock' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @ApiProperty({
    example: 'uuid-of-category',
    description: 'Category ID (must exist)',
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    description: 'Array of image URLs',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    example: ['S', 'M', 'L', 'XL'],
    description: 'Array of available sizes',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  sizes?: string[];

  @ApiProperty({
    example: ['Red', 'Blue', 'Black'],
    description: 'Array of available colors',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  colors?: string[];
}
