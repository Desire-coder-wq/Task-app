import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class InvitationsService {
  private readonly logger = new Logger(InvitationsService.name);

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async createInvitation(invitedById: string, dto: CreateInvitationDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Check for pending invitation
    const existingInvitation = await this.prisma.invitation.findFirst({
      where: {
        email: dto.email,
        status: 'PENDING',
        expiresAt: { gt: new Date() },
      },
    });

    if (existingInvitation) {
      throw new BadRequestException('An invitation has already been sent to this email');
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    // Get inviter details for email
    const inviter = await this.prisma.user.findUnique({
      where: { id: invitedById },
      select: { name: true, email: true },
    });

    // Create invitation - include teamId if provided
    const invitation = await this.prisma.invitation.create({
      data: {
        email: dto.email,
        token,
        expiresAt,
        invitedById,
        status: 'PENDING',
        teamId: dto.teamId || null,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'https://task-flow-frontend-0t16.onrender.com';
    const acceptUrl = `${frontendUrl}/accept-invitation?token=${token}`;

    // Send email
    try {
      await this.mailService.sendInvitationEmail({
        to: dto.email,
        name: dto.name,
        token: token,
        inviterName: inviter?.name || 'Someone',
        role: dto.role || 'MEMBER',
        acceptUrl: acceptUrl,
      });
      this.logger.log(`Invitation email sent to ${dto.email}`);
    } catch (err: any) {
      this.logger.error(
        `Failed to send invitation email to ${dto.email}`,
        err?.stack || err?.message || err,
      );
      // Still return the invitation so user can resend; frontend will show a warning
    }

    return {
      ...invitation,
      acceptUrl,
    };
  }

  async acceptInvitation(dto: AcceptInvitationDto) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token: dto.token },
      include: { invitedBy: true, team: true },
    });

    if (!invitation) {
      throw new NotFoundException('Invalid invitation token');
    }

    if (invitation.status !== 'PENDING') {
      throw new BadRequestException('Invitation has already been processed');
    }

    if (invitation.expiresAt < new Date()) {
      throw new BadRequestException('Invitation has expired');
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: invitation.email },
    });

    let user;
    let isNewUser = false;

    if (existingUser) {
      user = existingUser;
    } else {
      // Create new user
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      // Use dto.name if provided, otherwise use email username
      const userName = dto.name || invitation.email.split('@')[0];
      user = await this.prisma.user.create({
        data: {
          email: invitation.email,
          password: hashedPassword,
          name: userName,
          role: 'USER',
        },
      });
      isNewUser = true;
    }

    // Update invitation status
    await this.prisma.invitation.update({
      where: { id: invitation.id },
      data: {
        status: 'ACCEPTED',
        invitedUserId: user.id,
      },
    });

    // If teamId exists, add user to team
    if (invitation.teamId) {
      // Check if user is already a member of the team
      const existingMember = await this.prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId: invitation.teamId,
            userId: user.id,
          },
        },
      });

      if (!existingMember) {
        await this.prisma.teamMember.create({
          data: {
            teamId: invitation.teamId,
            userId: user.id,
            role: 'MEMBER',
          },
        });
      }
    }

    // Send welcome email to new users
    if (isNewUser) {
      try {
        await this.mailService.sendWelcomeEmail({
          to: user.email,
          name: user.name,
          teamName: invitation.team?.name || 'TaskPilot',
        });
      } catch (err) {
        console.error('Failed to send welcome email:', err);
      }
    }

    return {
      message: 'Invitation accepted successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async getInvitations(invitedById: string) {
    return this.prisma.invitation.findMany({
      where: { invitedById },
      orderBy: { createdAt: 'desc' },
    });
  }

  async resendInvitation(invitationId: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id: invitationId },
      include: { invitedBy: true },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    const newToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    await this.prisma.invitation.update({
      where: { id: invitationId },
      data: {
        token: newToken,
        expiresAt,
        status: 'PENDING',
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'https://task-flow-frontend-0t16.onrender.com';
    const acceptUrl = `${frontendUrl}/accept-invitation?token=${newToken}`;

    try {
      await this.mailService.sendInvitationEmail({
        to: invitation.email,
        name: invitation.email.split('@')[0],
        token: newToken,
        inviterName: invitation.invitedBy?.name || 'Someone',
        role: 'MEMBER',
        acceptUrl: acceptUrl,
      });
      this.logger.log(`Invitation resent to ${invitation.email}`);
    } catch (err: any) {
      this.logger.error(
        `Failed to resend invitation email to ${invitation.email}`,
        err?.stack || err?.message || err,
      );
    }

    return { message: 'Invitation resent successfully' };
  }

  async cancelInvitation(invitationId: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    await this.prisma.invitation.update({
      where: { id: invitationId },
      data: { status: 'EXPIRED' },
    });

    return { message: 'Invitation cancelled successfully' };
  }
}