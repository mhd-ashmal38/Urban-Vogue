import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsObject,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * CreateVariantDto - Defines the structure for creating a product variant
 *
 * This DTO validates variant creation data for dress shopping app:
 * - color: Required string (e.g., "Red", "Blue", "Black")
 * - images: Required array of image URLs for this color
 * - sizeStock: Required JSON object with stock per size
 * - price: Optional, can override product base price
 */
export class CreateVariantDto {
  @ApiProperty({
    example: 'Red',
    description: 'Variant color name',
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    example: [
      'https://example.com/red-dress-1.jpg',
      'https://example.com/red-dress-2.jpg',
    ],
    description: 'Array of image URLs for this color variant',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty({
    example: { XS: 5, S: 10, M: 8, L: 0, XL: 3, XXL: 0 },
    description: 'Stock levels per size (JSON object)',
  })
  @IsObject()
  @IsNotEmpty()
  sizeStock: Record<string, number>;

  @ApiProperty({
    example: 29.99,
    description: 'Optional price override for this color variant',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  price?: number;
}
