import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  Min,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateVariantDto } from './create-variant.dto';

/**
 * CreateProductDto - Defines the structure for creating a new product
 *
 * This DTO validates product creation data for dress shopping app:
 * - name: Required
 * - description: Optional
 * - price: Required, base price for the product
 * - categoryId: Required, must reference an existing category
 * - variants: Required array of color variants with images and size stock
 *
 * Validation decorators from class-validator:
 * - @IsString() - Ensures the field is a string
 * - @IsOptional() - Field can be omitted
 * - @IsArray() - Ensures the field is an array
 * - @IsNumber() - Ensures the field is a number
 * - @Min() - Ensures the number is at least the specified value
 * - @IsNotEmpty() - Ensures the field is not empty
 * - @ValidateNested() - Validates nested objects
 *
 * ApiProperty decorators for Swagger documentation:
 * - @ApiProperty() - Describes the field in API docs
 */
export class CreateProductDto {
  @ApiProperty({ example: 'Summer Floral Dress', description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Beautiful summer dress with floral pattern',
    description: 'Product description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 49.99, description: 'Base product price' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({
    example: 'uuid-of-category',
    description: 'Category ID (must exist)',
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    description: 'Array of color variants with images and size stock',
    type: [CreateVariantDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants: CreateVariantDto[];
}
