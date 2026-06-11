import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional } from 'class-validator';

/**
 * UpdateUserDto - Defines the structure for updating a user
 *
 * This DTO:
 * - Extends CreateUserDto using PartialType
 * - Makes all fields optional (user can update any subset of fields)
 * - Reuses the same validation rules from CreateUserDto
 * - Adds resetToken and resetTokenExpiry for password reset
 *
 * PartialType explanation:
 * - Without PartialType, all fields from CreateUserDto would be required
 * - With PartialType, all fields become optional
 * - This is perfect for update operations where you might only change one field
 *
 * Example usage:
 * - Update only name: { name: "John" }
 * - Update only email: { email: "new@email.com" }
 * - Update both: { name: "John", email: "new@email.com" }
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  resetToken?: string;

  @IsOptional()
  resetTokenExpiry?: Date | string | null;
}
