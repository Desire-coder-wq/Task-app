import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  async sendInvitationEmail({
    to,
    name,
    token,
    inviterName,
    role,
    acceptUrl,
  }: {
    to: string;
    name: string;
    token: string;
    inviterName: string;
    role: string;
    acceptUrl: string;
  }) {
    this.logger.log(`Sending invitation email to ${to} (invited by ${inviterName})`);
    try {
      const info = await this.mailerService.sendMail({
        to,
        subject: `${inviterName} invited you to join TaskPilot as ${role}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f6f9;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f9; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden; max-width: 100%;">
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #1e293b, #0f172a); padding: 40px 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">TaskPilot</h1>
                        <p style="color: #94a3b8; margin: 8px 0 0; font-size: 16px;">Team Collaboration Made Simple</p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="color: #0f172a; font-size: 24px; font-weight: 600; margin: 0 0 16px;">You've been invited!</h2>
                        
                        <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 8px;">
                          Hello <strong style="color: #0f172a;">${name}</strong>,
                        </p>
                        
                        <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                          <strong style="color: #0f172a;">${inviterName}</strong> has invited you to join <strong style="color: #0f172a;">TaskPilot</strong> as a <strong style="color: #2563eb;">${role}</strong>.
                        </p>
                        
                        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
                          <p style="margin: 0 0 4px; color: #64748b; font-size: 14px;">Your role:</p>
                          <p style="margin: 0; color: #0f172a; font-size: 18px; font-weight: 600;">${role}</p>
                        </div>
                        
                        <div style="text-align: center; margin: 32px 0;">
                          <a href="${acceptUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 48px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                            Accept Invitation
                          </a>
                        </div>
                        
                        <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; text-align: center;">
                          This invitation expires in <strong style="color: #0f172a;">48 hours</strong>.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
                        
                        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
                          If you didn't expect this invitation, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                          © 2026 TaskPilot. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      });
      this.logger.log(`Invitation email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send invitation email to ${to}`, error);
      throw error;
    }
  }

  async sendWelcomeEmail({
    to,
    name,
    teamName,
  }: {
    to: string;
    name: string;
    teamName: string;
  }) {
    this.logger.log(`Sending welcome email to ${to} for team ${teamName}`);
    try {
      await this.mailerService.sendMail({
        to,
        subject: `Welcome to ${teamName}!`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f6f9;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f9; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden; max-width: 100%;">
                    <tr>
                      <td style="background: linear-gradient(135deg, #1e293b, #0f172a); padding: 40px 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to TaskPilot!</h1>
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="color: #0f172a; font-size: 22px; font-weight: 600; margin: 0 0 16px;">Hello ${name}!</h2>
                        
                        <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
                          You have successfully joined <strong style="color: #0f172a;">${teamName}</strong> on TaskPilot.
                        </p>
                        
                        <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                          You can now log in and start collaborating with your team on tasks and projects.
                        </p>
                        
                        <div style="text-align: center; margin: 32px 0;">
                          <a href="${process.env.FRONTEND_URL || 'https://task-flow-frontend-0t16.onrender.com'}/login" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 48px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                            Log In Now
                          </a>
                        </div>
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                          © 2026 TaskPilot. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      });
      this.logger.log(`Welcome email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${to}`, error);
      throw error;
    }
  }

  async sendOtpEmail(to: string, name: string, otp: string) {
    this.logger.log(`Sending OTP email to ${to}`);
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Password Reset OTP - TaskPilot',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f6f9;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f9; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden; max-width: 100%;">
                    <tr>
                      <td style="background: linear-gradient(135deg, #1e293b, #0f172a); padding: 40px 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">TaskPilot</h1>
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="color: #0f172a; font-size: 24px; font-weight: 600; margin: 0 0 16px;">Reset Your Password</h2>
                        
                        <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 8px;">
                          Hello <strong style="color: #0f172a;">${name}</strong>,
                        </p>
                        
                        <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                          You requested to reset your password. Use the OTP below to reset your password.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f0f4ff; border-radius: 8px;">
                          <p style="font-size: 32px; font-weight: bold; color: #1e293b; letter-spacing: 8px; margin: 0;">
                            ${otp}
                          </p>
                        </div>
                        
                        <p style="color: #94a3b8; font-size: 14px; text-align: center;">
                          This OTP expires in <strong style="color: #0f172a;">10 minutes</strong>.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
                        
                        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
                          If you didn't request this, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                          © 2026 TaskPilot. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      });
      this.logger.log(`OTP email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${to}`, error);
      throw error;
    }
  }

  async sendTestEmail(to: string) {
    this.logger.log(`Sending test email to ${to}`);
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'TaskPilot Email Test',
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"><title>Email Test</title></head>
          <body style="font-family: Arial, sans-serif; padding: 40px; background:#f4f6f9;">
            <div style="max-width: 500px; margin: 0 auto; background:#fff; padding:30px; border-radius:8px; box-shadow:0 1px 5px rgba(0,0,0,0.1);">
              <h2 style="color:#0f172a;">Email Configuration Test</h2>
              <p style="color:#334155; line-height:1.6;">
                If you received this email, your SMTP configuration is working correctly.
              </p>
              <p style="color:#0f172a; font-weight:600;">SMTP connection successful</p>
              <hr style="border:none; border-top:1px solid #e2e8f0; margin:20px 0;">
              <p style="color:#94a3b8; font-size:12px;">TaskPilot - Sent at ${new Date().toISOString()}</p>
            </div>
          </body>
          </html>
        `,
      });
      this.logger.log(`Test email sent successfully to ${to}`);
      return { message: 'Test email sent successfully', success: true };
    } catch (error) {
      this.logger.error(`Failed to send test email to ${to}`, error);
      throw error;
    }
  }
}