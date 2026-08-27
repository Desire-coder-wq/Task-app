import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional } from 'class-validator';

export class AcceptInvitationDto {
  @ApiProperty({ example: 'invitation-token-here' })
  @IsString()
  token!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'New User', required: false })
  @IsOptional()
  @IsString()
  name?: string;
}