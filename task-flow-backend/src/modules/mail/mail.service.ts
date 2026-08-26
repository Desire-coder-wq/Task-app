import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendInvitationEmail(to: string, name: string, token: string, invitedById: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const acceptUrl = `${frontendUrl}/accept-invitation?token=${token}`;

    try {
      await this.mailerService.sendMail({
        to,
        subject: 'You have been invited to join TaskPilot',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
            <div style="background-color: #1e293b; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0;">TaskPilot</h1>
            </div>
            <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
              <h2 style="color: #1e293b;">You've been invited!</h2>
              <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                Hello <strong>${name}</strong>,
              </p>
              <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                You have been invited to join TaskPilot. Click the button below to accept the invitation and set up your account.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${acceptUrl}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                  Accept Invitation
                </a>
              </div>
              <p style="color: #94a3b8; font-size: 14px; text-align: center;">
                This invitation expires in 48 hours.
              </p>
              <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
                If you didn't expect this invitation, you can safely ignore this email.
              </p>
            </div>
          </div>
        `,
      });
      console.log(`Invitation email sent to ${to}`);
    } catch (error) {
      console.error('Failed to send invitation email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(to: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Welcome to TaskPilot!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
            <div style="background-color: #1e293b; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0;">TaskPilot</h1>
            </div>
            <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
              <h2 style="color: #1e293b;">Welcome to TaskPilot!</h2>
              <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                Hello <strong>${name}</strong>,
              </p>
              <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                Welcome to TaskPilot! You have successfully joined the team. You can now log in and start collaborating on tasks.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                  Log In
                </a>
              </div>
            </div>
          </div>
        `,
      });
      console.log(`Welcome email sent to ${to}`);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw error;
    }
  }

  async sendOtpEmail(to: string, name: string, otp: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Password Reset OTP - TaskPilot',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
            <div style="background-color: #1e293b; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0;">TaskPilot</h1>
            </div>
            <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
              <h2 style="color: #1e293b;">Reset Your Password</h2>
              <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                Hello <strong>${name}</strong>,
              </p>
              <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                You requested to reset your password. Use the OTP below to reset your password.
              </p>
              <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f0f4ff; border-radius: 8px;">
                <p style="font-size: 32px; font-weight: bold; color: #1e293b; letter-spacing: 8px; margin: 0;">
                  ${otp}
                </p>
              </div>
              <p style="color: #94a3b8; font-size: 14px; text-align: center;">
                This OTP expires in 10 minutes.
              </p>
              <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
                If you didn't request this, you can safely ignore this email.
              </p>
            </div>
          </div>
        `,
      });
      console.log(`OTP email sent to ${to}`);
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      throw error;
    }
  }
}