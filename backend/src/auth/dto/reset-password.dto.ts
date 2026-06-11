import { IsString, MinLength, Matches } from 'class-validator';

/**
 * ResetPasswordDto - DTO for resetting password with token
 *
 * This DTO validates the password reset:
 * - token: The reset token sent to user's email
 * - password: New password (min 6 chars)
 *
 * Flow:
 * 1. User receives reset token via email
 * 2. User submits token + new password
 * 3. System validates token (not expired, matches user)
 * 4. System updates password and clears reset token
 */
export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;
}
