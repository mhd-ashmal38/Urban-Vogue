import nodemailer from 'nodemailer';

async function generateEtherealCredentials() {
  try {
    const testAccount = await nodemailer.createTestAccount();

    console.log('=================================');
    console.log('ETHEREAL EMAIL CREDENTIALS');
    console.log('=================================');
    console.log(`EMAIL_HOST=smtp.ethereal.email`);
    console.log(`EMAIL_PORT=587`);
    console.log(`EMAIL_USER=${testAccount.user}`);
    console.log(`EMAIL_PASSWORD=${testAccount.pass}`);
    console.log(`EMAIL_FROM=Urban Vogue <noreply@urbanvogue.com>`);
    console.log('=================================');
    console.log('');
    console.log('Add these to your .env file');
    console.log('View sent emails at: https://ethereal.email/messages');
    console.log('Login with the credentials above to view emails');
  } catch (error) {
    console.error('Error generating credentials:', error);
  }
}

void generateEtherealCredentials();
