import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async createTeam(userId: string, data: CreateTeamDto) {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existingTeam = await this.prisma.team.findUnique({
      where: { slug },
    });

    if (existingTeam) {
      throw new BadRequestException('A team with this name already exists');
    }

    return this.prisma.team.create({
      data: {
        name: data.name,
        description: data.description,
        slug,
        createdById: userId,
        members: {
          create: {
            userId: userId,
            role: 'OWNER',
          },
        },
      },
    });
  }

  async getUserTeams(userId: string) {
    return this.prisma.team.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            tasks: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTeam(teamId: string, userId: string) {
    const member = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    });

    if (!member) {
      throw new ForbiddenException('You do not have access to this team');
    }

    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        tasks: {
          include: {
            assignedUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        invitations: {
          where: { status: 'PENDING' },
        },
        _count: {
          select: {
            members: true,
            tasks: true,
          },
        },
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }

  async getTeamMembers(teamId: string, userId: string) {
    const member = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    });

    if (!member) {
      throw new ForbiddenException('You do not have access to this team');
    }

    return this.prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        joinedAt: 'desc',
      },
    });
  }

  async updateTeam(teamId: string, userId: string, data: UpdateTeamDto) {
    const member = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    });

    if (!member || !['OWNER', 'ADMIN'].includes(member.role)) {
      throw new ForbiddenException('You do not have permission to update this team');
    }

    let slug: string | undefined;
    if (data.name) {
      slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const existingTeam = await this.prisma.team.findFirst({
        where: {
          slug,
          id: { not: teamId },
        },
      });

      if (existingTeam) {
        throw new BadRequestException('A team with this name already exists');
      }
    }

    return this.prisma.team.update({
      where: { id: teamId },
      data: {
        ...data,
        ...(slug && { slug }),
      },
    });
  }

  async deleteTeam(teamId: string, userId: string) {
    const member = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    });

    if (!member || member.role !== 'OWNER') {
      throw new ForbiddenException('Only the team owner can delete this team');
    }

    await this.prisma.$transaction([
      this.prisma.teamMember.deleteMany({ where: { teamId } }),
      this.prisma.task.deleteMany({ where: { teamId } }),
      this.prisma.invitation.deleteMany({ where: { teamId } }),
      this.prisma.team.delete({ where: { id: teamId } }),
    ]);

    return { message: 'Team deleted successfully' };
  }

  async getUserRoleInTeam(teamId: string, userId: string) {
    const member = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
      select: { role: true },
    });

    return member?.role || null;
  }
}