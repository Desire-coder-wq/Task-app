import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from '../mail/mail.service';

interface OtpEntry {
  otp: string;
  expiresAt: Date;
}

@Injectable()
export class AuthService {
  private otpStore = new Map<string, OtpEntry>();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, role } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'USER',
      },
    });

    const token = this.generateToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('No account found with this email');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    this.otpStore.set(email, { otp, expiresAt });

    // Send OTP via email
    try {
      await this.mailService.sendOtpEmail(email, user.name, otp);
      console.log(`OTP sent to ${email}: ${otp}`);
    } catch (error) {
      console.error('Failed to send OTP email:', error);
    }

    return {
      message: 'OTP sent to your email',
      // Only return OTP in development for testing
      devOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;

    const entry = this.otpStore.get(email);

    if (!entry || entry.otp !== otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (new Date() > entry.expiresAt) {
      this.otpStore.delete(email);
      throw new BadRequestException('OTP has expired');
    }

    return {
      message: 'OTP verified successfully',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, otp, password } = resetPasswordDto;

    const entry = this.otpStore.get(email);

    if (!entry || entry.otp !== otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (new Date() > entry.expiresAt) {
      this.otpStore.delete(email);
      throw new BadRequestException('OTP has expired');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    this.otpStore.delete(email);

    return {
      message: 'Password reset successfully',
    };
  }

  async logout() {
    return {
      message: 'Logged out successfully',
    };
  }

  private generateToken(userId: string, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }
}