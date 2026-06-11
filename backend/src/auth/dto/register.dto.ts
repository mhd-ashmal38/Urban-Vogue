import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

/**
 * RegisterDto - Defines the structure for user registration
 *
 * This DTO validates registration data:
 * - email: Must be a valid email format
 * - password: Must be at least 6 characters
 * - name: Optional (user can register without providing name)
 *
 * Similar to CreateUserDto but specifically for auth flow
 * This separation allows different validation rules for auth vs admin user creation
 */
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  name?: string;
}
