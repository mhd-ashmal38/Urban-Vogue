import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';
import * as path from 'path';

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

    // Read HTML template from file
    const templatePath = path.join(
      process.cwd(),
      'templates',
      'password-reset.hbs',
    );
    let htmlContent = '';

    try {
      htmlContent = fs.readFileSync(templatePath, 'utf-8');
    } catch (error) {
      console.error('Error reading email template:', error);
      // Fallback to simple HTML if template file not found
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1>Password Reset Request</h1>
          <p>Click the link below to reset your password:</p>
          <a href="${link}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
        </div>
      `;
    }

    // Replace placeholders with actual values
    htmlContent = htmlContent.replace(/\{\{resetLink\}\}/g, link);
    htmlContent = htmlContent.replace(/\{\{resetToken\}\}/g, resetToken);
    htmlContent = htmlContent.replace(/\{\{email\}\}/g, email);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request - Urban Vogue',
      html: htmlContent,
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
