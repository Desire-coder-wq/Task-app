import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { InvitationsModule } from './modules/invitations/invitations.module';
import { MailModule } from './modules/mail/mail.module';
import { TeamsModule } from './modules/teams/teams.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    TasksModule,
    UsersModule,
    DashboardModule,
    InvitationsModule,
    MailModule,
    TeamsModule,
  ],
})
export class AppModule {}