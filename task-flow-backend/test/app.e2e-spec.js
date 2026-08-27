"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../src/modules/auth/auth.service");
const auth_controller_1 = require("../src/modules/auth/auth.controller");
const jwt_strategy_1 = require("../src/modules/auth/strategies/jwt.strategy");
const mail_service_1 = require("../src/modules/mail/mail.service");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const mockPrismaService = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
};
const mockJwtService = {
    sign: jest.fn(() => 'test-token'),
};
const mockMailService = {
    sendOtpEmail: jest.fn(),
};
jest.mock('bcrypt', () => ({
    hash: jest.fn(() => Promise.resolve('hashedpassword')),
    compare: jest.fn(() => Promise.resolve(true)),
}));
let TestAuthModule = class TestAuthModule {
};
TestAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'test-secret',
                    signOptions: { expiresIn: '7d' },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            jwt_strategy_1.JwtStrategy,
            {
                provide: prisma_service_1.PrismaService,
                useValue: mockPrismaService,
            },
            {
                provide: mail_service_1.MailService,
                useValue: mockMailService,
            },
            {
                provide: 'JWT_SECRET',
                useValue: 'test-secret',
            },
        ],
    })
], TestAuthModule);
describe('Auth (e2e)', () => {
    let app;
    beforeEach(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [TestAuthModule],
        })
            .overrideProvider(jwt_1.JwtService)
            .useValue(mockJwtService)
            .compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    it('/auth/register (POST)', () => {
        mockPrismaService.user.findUnique.mockResolvedValue(null);
        mockPrismaService.user.create.mockResolvedValue({
            id: '1',
            email: 'testuser@example.com',
            name: 'Test User',
            password: 'hashed',
            role: 'USER',
            avatar: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/register')
            .send({
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123',
        })
            .expect(201)
            .expect((res) => {
            expect(res.body.user.email).toBe('testuser@example.com');
            expect(res.body.token).toBe('test-token');
        });
    });
    it('/auth/login (POST)', () => {
        mockPrismaService.user.findUnique.mockResolvedValue({
            id: '1',
            email: 'testuser@example.com',
            name: 'Test User',
            password: '$2b$10$hashedpassword',
            role: 'USER',
            avatar: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/login')
            .send({
            email: 'testuser@example.com',
            password: 'password123',
        })
            .expect(200)
            .expect((res) => {
            expect(res.body.user.email).toBe('testuser@example.com');
            expect(res.body.token).toBe('test-token');
        });
    });
});
//# sourceMappingURL=app.e2e-spec.js.map