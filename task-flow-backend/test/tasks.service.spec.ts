import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../src/modules/tasks/tasks.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;

  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: new Date('2026-09-01'),
    assignedUserId: 'user1',
    createdById: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    task: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated tasks', async () => {
      const filters = { page: 1, limit: 10 };
      mockPrismaService.task.findMany.mockResolvedValue([mockTask]);
      mockPrismaService.task.count.mockResolvedValue(1);

      const result = await service.findAll(filters);
      
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(mockTask);

      const result = await service.findOne('1');
      
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createDto = {
        title: 'New Task',
        description: 'New Description',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: '2026-09-01',
        assignedUserId: 'user1',
      };

      mockPrismaService.task.create.mockResolvedValue({ ...mockTask, ...createDto });

      const result = await service.create(createDto);
      
      expect(result).toHaveProperty('title', 'New Task');
    });
  });
});