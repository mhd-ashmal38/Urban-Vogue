import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * LoginDto - Defines the structure for user login
 *
 * This DTO validates login data:
 * - email: Must be a valid email format
 * - password: Must be at least 6 characters
 *
 * This is used for authentication - the service will:
 * 1. Find the user by email
 * 2. Compare the password hash
 * 3. Generate a JWT token if credentials are valid
 */
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
