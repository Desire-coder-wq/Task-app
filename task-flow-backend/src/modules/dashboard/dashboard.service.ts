import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(userId: string) {
    const totalTasks = await this.prisma.task.count({
      where: { createdById: userId },
    });

    const completedTasks = await this.prisma.task.count({
      where: { createdById: userId, status: 'COMPLETED' },
    });

    const inProgressTasks = await this.prisma.task.count({
      where: { createdById: userId, status: 'IN_PROGRESS' },
    });

    const todoTasks = await this.prisma.task.count({
      where: { createdById: userId, status: 'TODO' },
    });

    const overdueTasks = await this.prisma.task.count({
      where: {
        createdById: userId,
        status: { not: 'COMPLETED' },
        dueDate: { lt: new Date() },
      },
    });

    const highPriorityTasks = await this.prisma.task.count({
      where: { createdById: userId, priority: 'HIGH' },
    });

    const mediumPriorityTasks = await this.prisma.task.count({
      where: { createdById: userId, priority: 'MEDIUM' },
    });

    const lowPriorityTasks = await this.prisma.task.count({
      where: { createdById: userId, priority: 'LOW' },
    });

    return {
      total: totalTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      todo: todoTasks,
      overdue: overdueTasks,
      priorityStats: {
        high: highPriorityTasks,
        medium: mediumPriorityTasks,
        low: lowPriorityTasks,
      },
    };
  }

  async getUpcoming(userId: string) {
    const tasks = await this.prisma.task.findMany({
      where: {
        createdById: userId,
        status: { not: 'COMPLETED' },
        dueDate: { gte: new Date() },
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
      take: 5,
    });

    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.toISOString(),
      assignedUser: task.assignedUser,
    }));
  }
}
