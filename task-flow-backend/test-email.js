const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('Testing Resend SMTP...');
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 587,
    secure: false,
    auth: {
      user: 'resend',
      pass: 're_75DXQbnC_EvyFH45bwk5zmiQ5eEvLEEZj',
    },
  });

  try {
    const info = await transporter.sendMail({
      from: 'onboarding@resend.dev',
      to: 'asinguradesirecomfort@gmail.com',
      subject: 'Test Email from TaskPilot',
      text: 'This is a test email to verify SMTP configuration.',
      html: '<h1>TaskPilot Test Email</h1><p>If you received this, your SMTP is working!</p>',
    });
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

testEmail();