import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

class TestEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

@ApiTags('mail')
@ApiBearerAuth('JWT-auth')
@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  @Get('config')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Check SMTP configuration (does not expose password)' })
  getConfig() {
    const smtpHost = this.configService.get('SMTP_HOST');
    const smtpPort = this.configService.get('SMTP_PORT');
    const smtpUser = this.configService.get('SMTP_USER');
    const smtpPass = this.configService.get('SMTP_PASS');
    return {
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPassSet: !!smtpPass && smtpPass !== '${SMTP_PASS}' && smtpPass !== undefined,
      smtpPassLength: smtpPass ? smtpPass.length : 0,
      smtpPassPreview: smtpPass ? smtpPass.substring(0, 4) + '...' : null,
      smtpFrom: this.configService.get('SMTP_FROM'),
      smtpFromName: this.configService.get('SMTP_FROM_NAME'),
    };
  }

  @Post('test')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a test email to verify SMTP configuration' })
  @ApiResponse({ status: 200, description: 'Test email sent successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Failed to send email' })
  async sendTestEmail(@Body() dto: TestEmailDto) {
    return this.mailService.sendTestEmail(dto.email);
  }
}
