import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AcceptInvitationDto {
  @ApiProperty({ example: 'invitation-token-here' })
  @IsString()
  token!:string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password!:string;
}