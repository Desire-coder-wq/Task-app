const nodemailer = require('nodemailer');

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
      user: 'your-email@gmail.com',
      pass: 'YOUR_API_KEY_HERE', // Replace with placeholder
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"TaskPilot" <your-email@gmail.com>',
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test email',
    });
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

testEmail();