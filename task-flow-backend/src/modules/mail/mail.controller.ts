import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
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
  constructor(private readonly mailService: MailService) {}

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
