import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || process.env.EMAIL_FROM || 'Family Vault <no-reply@yourdomain.com>';

// Only configure SendGrid if API key is provided
if (SENDGRID_API_KEY && SENDGRID_API_KEY.trim() && SENDGRID_API_KEY !== 'your_sendgrid_key') {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export async function sendEmail(to: string, subject: string, html: string) {
  // If SendGrid is not configured, log to console for development
  if (!SENDGRID_API_KEY || !SENDGRID_API_KEY.trim() || SENDGRID_API_KEY === 'your_sendgrid_key') {
    console.log('\n📧 EMAIL (Development Mode):');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('HTML Content:', html);
    console.log('📧 END EMAIL\n');
    return;
  }

  const msg = {
    to,
    from: FROM_EMAIL,
    subject,
    html,
  };

  try {
    console.log('🔧 Attempting to send email via SendGrid...');
    console.log('From:', FROM_EMAIL);
    console.log('To:', to);
    console.log('Subject:', subject);
    
    const result = await sgMail.send(msg);
    console.log('✅ Email sent successfully via SendGrid!');
    console.log('SendGrid Response:', result[0].statusCode);
  } catch (error: any) {
    console.error('❌ SendGrid Error Details:');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    if (error.response && error.response.body && error.response.body.errors) {
      console.error('SendGrid Errors:', JSON.stringify(error.response.body.errors, null, 2));
    }
    throw error; // Re-throw to maintain existing error handling
  }
}

export async function sendVerificationCode(email: string, code: string) {
  const subject = 'Your FamilyVault Verification Code';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #D4AF37;">Verification Code</h2>
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>This code will expire in 10 minutes.</p>
    </div>
  `;

  await sendEmail(email, subject, html);
}
