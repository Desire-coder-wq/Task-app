import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../src/modules/tasks/tasks.controller';
import { TasksService } from '../src/modules/tasks/tasks.service';

describe('TasksController', () => {
  let controller: TasksController;

  const mockTasksService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const result = { items: [], total: 0, page: 1, limit: 10, totalPages: 0 };
      mockTasksService.findAll.mockResolvedValue(result);

      expect(await controller.findAll({})).toBe(result);
    });
  });
});