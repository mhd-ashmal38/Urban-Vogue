import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * UpdateUserDto - Defines the structure for updating a user
 *
 * This DTO:
 * - Extends CreateUserDto using PartialType
 * - Makes all fields optional (user can update any subset of fields)
 * - Reuses the same validation rules from CreateUserDto
 * - Adds role, isActive, and token fields for admin management
 *
 * PartialType explanation:
 * - Without PartialType, all fields from CreateUserDto would be required
 * - With PartialType, all fields become optional
 * - This is perfect for update operations where you might only change one field
 *
 * Example usage:
 * - Update only name: { name: "John" }
 * - Update role: { role: "ADMIN" }
 * - Deactivate user: { isActive: false }
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'ADMIN', required: false, enum: ['USER', 'ADMIN'] })
  @IsEnum(['USER', 'ADMIN'])
  @IsOptional()
  role?: 'USER' | 'ADMIN';

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  resetToken?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  resetTokenExpiry?: Date | string | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  refreshToken?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  refreshTokenExpiry?: Date | null;
}
