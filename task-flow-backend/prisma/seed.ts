import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo users
  const users = [
    {
      email: 'desire@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Desire',
      role: 'ADMIN',
    },
    {
      email: 'mary@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Mary Precious',
      role: 'USER',
    },
    {
      email: 'bright@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Bright Musinguzi',
      role: 'USER',
    },
    {
      email: 'alex@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Alex Ssempera',
      role: 'USER',
    },
  ];

  for (const userData of users) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
  }

  // Get users for task assignment
  const dbUsers = await prisma.user.findMany();
  const desire = dbUsers.find(u => u.email === 'desire@example.com');
  const mary = dbUsers.find(u => u.email === 'mary@example.com');
  const bright = dbUsers.find(u => u.email === 'bright@example.com');
  const alex = dbUsers.find(u => u.email === 'alex@example.com');

  if (!desire || !mary || !bright || !alex) {
    console.error('Required users not found');
    process.exit(1);
  }

  // Create sample tasks
  const tasks = [
    {
      title: 'Design dashboard layout',
      description: 'Create responsive dashboard with sidebar navigation',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date('2026-09-01'),
      assignedUserId: desire.id,
      createdById: desire.id,
    },
    {
      title: 'Implement task CRUD operations',
      description: 'Add create, read, update, delete functionality for tasks',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date('2026-08-30'),
      assignedUserId: mary.id,
      createdById: desire.id,
    },
    {
      title: 'Setup API integration',
      description: 'Connect frontend with backend REST API',
      status: 'COMPLETED',
      priority: 'HIGH',
      dueDate: new Date('2026-08-25'),
      assignedUserId: desire.id,
      createdById: desire.id,
    },
    {
      title: 'Write unit tests',
      description: 'Add test coverage for components and services',
      status: 'TODO',
      priority: 'LOW',
      dueDate: new Date('2026-09-10'),
      assignedUserId: bright.id,
      createdById: mary.id,
    },
    {
      title: 'Deploy to AWS',
      description: 'Setup CI/CD pipeline and deploy to AWS',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date('2026-09-05'),
      assignedUserId: mary.id,
      createdById: desire.id,
    },
    {
      title: 'Q3 Financial Report',
      description: 'Compile and review final statements for board distribution',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: new Date('2026-09-15'),
      assignedUserId: desire.id,
      createdById: desire.id,
    },
    {
      title: 'Client Presentation Deck',
      description: 'Finalize slides for the new marketing campaign pitch',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: new Date('2026-09-20'),
      assignedUserId: alex.id,
      createdById: mary.id,
    },
    {
      title: 'API Integration Test',
      description: 'Run final unit tests on the new payment gateway integration',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: new Date('2026-09-12'),
      assignedUserId: bright.id,
      createdById: desire.id,
    },
    {
      title: 'Q3 Financial Review',
      description: 'Review quarterly financial performance and prepare reports',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: new Date('2026-10-01'),
      assignedUserId: desire.id,
      createdById: desire.id,
    },
    {
      title: 'Design System Overhaul',
      description: 'Update the design system with new components and patterns',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: new Date('2026-09-28'),
      assignedUserId: alex.id,
      createdById: mary.id,
    },
  ];

  for (const taskData of tasks) {
    await prisma.task.create({
      data: taskData,
    });
  }

  console.log('Database seeded successfully');
  console.log('Demo users:');
  console.log('  - desire@example.com / password123 (ADMIN)');
  console.log('  - mary@example.com / password123 (USER)');
  console.log('  - bright@example.com / password123 (USER)');
  console.log('  - alex@example.com / password123 (USER)');
  console.log('Total tasks created:', tasks.length);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });