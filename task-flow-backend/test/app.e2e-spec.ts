import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Module } from '@nestjs/common';
import { AuthService } from '../src/modules/auth/auth.service';
import { AuthController } from '../src/modules/auth/auth.controller';
import { JwtStrategy } from '../src/modules/auth/strategies/jwt.strategy';
import { MailService } from '../src/modules/mail/mail.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'test-secret',
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: PrismaService,
      useValue: mockPrismaService,
    },
    {
      provide: MailService,
      useValue: mockMailService,
    },
    {
      provide: 'JWT_SECRET',
      useValue: 'test-secret',
    },
  ],
})
class TestAuthModule {}

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAuthModule],
    })
      .overrideProvider(JwtService)
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

    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
      })
      .expect(201)
      .expect((res: { body: { user: { email: string }; token: string } }) => {
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

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      })
      .expect(200)
      .expect((res: { body: { user: { email: string }; token: string } }) => {
        expect(res.body.user.email).toBe('testuser@example.com');
        expect(res.body.token).toBe('test-token');
      });
  });
});
