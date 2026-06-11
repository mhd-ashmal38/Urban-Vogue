import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';

/**
 * EmailModule - Handles email sending functionality
 *
 * This module:
 * - Configures Nodemailer with Ethereal email service
 * - Provides EmailService for sending emails
 * - Used for password reset emails
 *
 * Ethereal Email:
 * - Fake email service for development/testing
 * - Captures emails for preview at https://ethereal.email/messages
 * - Not suitable for production (use SendGrid, Mailgun, AWS SES, etc.)
 */
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        port: parseInt(process.env.EMAIL_PORT || '587', 10),
        auth: {
          user: process.env.EMAIL_USER || 'kelvin.raynor@ethereal.email',
          pass: process.env.EMAIL_PASSWORD || 'h2QmDthJ47M4r41Zsg',
        },
      },
      defaults: {
        from: process.env.EMAIL_FROM || 'Urban Vogue <noreply@urbanvogue.com>',
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
