import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

/**
 * EmailService - Handles email sending
 *
 * This service:
 * - Sends emails using Nodemailer
 * - Used for password reset emails
 * - Can be extended for other email types (welcome, notifications, etc.)
 */
@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  /**
   * Send password reset email
   * @param email - User's email address
   * @param resetToken - Password reset token
   * @param resetLink - Full reset link (frontend URL + token)
   *
   * In production, you would:
   * - Use your frontend URL for the reset link
   * - Customize the email template with HTML
   * - Add branding and styling
   */
  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    resetLink?: string,
  ) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const link =
      resetLink || `${frontendUrl}/reset-password?token=${resetToken}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request - Urban Vogue',
      template: 'password-reset', // You can create HTML templates
      context: {
        resetLink: link,
        resetToken,
        email,
      },
      // For now, using plain text (upgrade to HTML template later)
      text: `
        You requested a password reset for your Urban Vogue account.

        Click the link below to reset your password:
        ${link}

        This link will expire in 1 hour.

        If you didn't request this, please ignore this email.
      `,
    });

    return { message: 'Email sent successfully' };
  }
}
