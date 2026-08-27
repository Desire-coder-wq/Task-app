"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaMockModule = exports.mockPrismaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
exports.mockPrismaService = {
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
let PrismaMockModule = class PrismaMockModule {
};
exports.PrismaMockModule = PrismaMockModule;
exports.PrismaMockModule = PrismaMockModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: prisma_service_1.PrismaService,
                useValue: exports.mockPrismaService,
            },
        ],
        exports: [prisma_service_1.PrismaService],
    })
], PrismaMockModule);
//# sourceMappingURL=prisma.mock.module.js.map