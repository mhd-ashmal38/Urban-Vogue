import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * CreateCategoryDto - Defines the structure for creating a new category
 *
 * This DTO validates category creation data:
 * - name: Required, must be at least 2 characters
 * - description: Optional
 *
 * Validation decorators from class-validator:
 * - @IsString() - Ensures the field is a string
 * - @IsOptional() - Field can be omitted
 * - @MinLength(2) - String must be at least 2 characters
 *
 * ApiProperty decorators for Swagger documentation:
 * - @ApiProperty() - Describes the field in API docs
 */
export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics', description: 'Category name' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 'Electronic devices and accessories',
    description: 'Category description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
