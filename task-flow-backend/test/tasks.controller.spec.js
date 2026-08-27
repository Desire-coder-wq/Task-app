"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const tasks_controllers_1 = require("../src/modules/tasks/tasks.controllers");
const tasks_service_1 = require("../src/modules/tasks/tasks.service");
describe('TasksController', () => {
    let controller;
    const mockTasksService = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateStatus: jest.fn(),
        remove: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [tasks_controllers_1.TasksController],
            providers: [
                {
                    provide: tasks_service_1.TasksService,
                    useValue: mockTasksService,
                },
            ],
        }).compile();
        controller = module.get(tasks_controllers_1.TasksController);
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
//# sourceMappingURL=tasks.controller.spec.js.map