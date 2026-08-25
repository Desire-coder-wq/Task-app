import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log(' Seeding database...');

  // Create demo users
  const users = [
    {
      email: 'john@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'John Doe',
      role: 'ADMIN',
    },
    {
      email: 'jane@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Jane Smith',
      role: 'USER',
    },
    {
      email: 'bob@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Bob Johnson',
      role: 'USER',
    },
    {
      email: 'alex@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Alex Rivers',
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
  const john = dbUsers.find(u => u.email === 'john@example.com');
  const jane = dbUsers.find(u => u.email === 'jane@example.com');
  const bob = dbUsers.find(u => u.email === 'bob@example.com');
  const alex = dbUsers.find(u => u.email === 'alex@example.com');

  // Create sample tasks
  const tasks = [
    {
      title: 'Design dashboard layout',
      description: 'Create responsive dashboard with sidebar navigation',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date('2026-09-01'),
      assignedUserId: john.id,
      createdById: john.id,
    },
    {
      title: 'Implement task CRUD operations',
      description: 'Add create, read, update, delete functionality for tasks',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date('2026-08-30'),
      assignedUserId: jane.id,
      createdById: john.id,
    },
    {
      title: 'Setup API integration',
      description: 'Connect frontend with backend REST API',
      status: 'COMPLETED',
      priority: 'HIGH',
      dueDate: new Date('2026-08-25'),
      assignedUserId: john.id,
      createdById: john.id,
    },
    {
      title: 'Write unit tests',
      description: 'Add test coverage for components and services',
      status: 'TODO',
      priority: 'LOW',
      dueDate: new Date('2026-09-10'),
      assignedUserId: bob.id,
      createdById: jane.id,
    },
    {
      title: 'Deploy to AWS',
      description: 'Setup CI/CD pipeline and deploy to AWS',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date('2026-09-05'),
      assignedUserId: jane.id,
      createdById: john.id,
    },
    {
      title: 'Q3 Financial Report',
      description: 'Compile and review final statements for board distribution',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: new Date('2026-09-15'),
      assignedUserId: john.id,
      createdById: john.id,
    },
    {
      title: 'Client Presentation Deck',
      description: 'Finalize slides for the new marketing campaign pitch',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: new Date('2026-09-20'),
      assignedUserId: alex.id,
      createdById: jane.id,
    },
    {
      title: 'API Integration Test',
      description: 'Run final unit tests on the new payment gateway integration',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: new Date('2026-09-12'),
      assignedUserId: bob.id,
      createdById: john.id,
    },
  ];

  for (const taskData of tasks) {
    await prisma.task.create({
      data: taskData,
    });
  }

  console.log(' Database seeded successfully!');
  console.log(' Demo users:');
  console.log('  - john@example.com / password123 (ADMIN)');
  console.log('  - jane@example.com / password123 (USER)');
  console.log('  - bob@example.com / password123 (USER)');
  console.log('  - alex@example.com / password123 (USER)');
}

main()
  .catch((e) => {
    console.error(' Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });