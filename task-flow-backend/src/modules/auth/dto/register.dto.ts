import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ 
    example: 'John Doe', 
    description: 'User full name' 
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    example: 'john@example.com', 
    description: 'User email address' 
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'password123', 
    description: 'User password (min 6 characters)' 
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    example: 'USER', 
    description: 'User role',
    required: false 
  })
  @IsOptional()
  @IsString()
  role?: string;
}