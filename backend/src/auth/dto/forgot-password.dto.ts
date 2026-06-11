import { IsEmail } from 'class-validator';

/**
 * ForgotPasswordDto - DTO for forgot password request
 *
 * This DTO validates the email for password reset:
 * - email: Must be a valid email format
 *
 * Flow:
 * 1. User submits their email
 * 2. System generates a reset token
 * 3. System sends email with reset link (simulated - returns token for now)
 * 4. User clicks link and enters new password
 */
export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}
