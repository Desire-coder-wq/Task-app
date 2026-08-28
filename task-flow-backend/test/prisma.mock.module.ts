import { Module } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';

export const mockPrismaService = {
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  task: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

@Module({
  providers: [
    {
      provide: PrismaService,
      useValue: mockPrismaService,
    },
  ],
  exports: [PrismaService],
})
export class PrismaMockModule {}
