import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const smtpHost = configService.get('SMTP_HOST');
        const smtpPort = parseInt(configService.get('SMTP_PORT') || '587');
        const smtpUser = configService.get('SMTP_USER');
        const smtpPass = configService.get('SMTP_PASS');
        const smtpFrom = configService.get('SMTP_FROM');
        const smtpFromName = configService.get('SMTP_FROM_NAME');
        const isDev = configService.get('NODE_ENV') === 'development';

        console.log('MailModule - SMTP Configuration:', {
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          requireTLS: smtpPort !== 465,
          user: smtpUser,
          from: `"${smtpFromName}" <${smtpFrom}>`,
          debug: isDev,
        });

        return {
          transport: {
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            requireTLS: smtpPort !== 465,
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
            ...(isDev && { logger: true, debug: true }),
          },
          defaults: {
            from: `"${smtpFromName}" <${smtpFrom}>`,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}