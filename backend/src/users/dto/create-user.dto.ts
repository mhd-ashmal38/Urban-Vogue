import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

/**
 * CreateUserDto - Defines the structure for creating a new user
 *
 * This DTO validates user registration data:
 * - email: Must be a valid email format
 * - password: Must be at least 6 characters
 * - name: Optional (user can register without providing name)
 *
 * Validation decorators from class-validator:
 * - @IsEmail() - Ensures the field is a valid email
 * - @IsString() - Ensures the field is a string
 * - @IsOptional() - Field can be omitted
 * - @MinLength(6) - String must be at least 6 characters
 */
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  name?: string;
}
