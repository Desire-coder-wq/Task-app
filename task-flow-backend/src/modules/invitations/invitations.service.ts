import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class InvitationsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async createInvitation(invitedById: string, dto: CreateInvitationDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

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

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    const invitation = await this.prisma.invitation.create({
      data: {
        email: dto.email,
        token,
        expiresAt,
        invitedById,
        status: 'PENDING',
      },
    });

    const acceptUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/accept-invitation?token=${token}`;

    try {
      await this.mailService.sendInvitationEmail(dto.email, dto.name, token, invitedById);
    } catch (err) {
      console.error('Failed to send invitation email:', err);
    }

    return {
      ...invitation,
      acceptUrl,
    };
  }

  async acceptInvitation(dto: AcceptInvitationDto) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token: dto.token },
      include: { invitedBy: true },
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

    const existingUser = await this.prisma.user.findUnique({
      where: { email: invitation.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: invitation.email,
        password: hashedPassword,
        name: invitation.email.split('@')[0],
        role: 'USER',
      },
    });

    await this.prisma.invitation.update({
      where: { id: invitation.id },
      data: {
        status: 'ACCEPTED',
        invitedUserId: user.id,
      },
    });

    try {
      await this.mailService.sendWelcomeEmail(user.email, user.name);
    } catch (err) {
      console.error('Failed to send welcome email:', err);
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

    try {
      await this.mailService.sendInvitationEmail(
        invitation.email,
        invitation.email.split('@')[0],
        newToken,
        invitation.invitedById,
      );
    } catch (err) {
      console.error('Failed to resend invitation email:', err);
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
