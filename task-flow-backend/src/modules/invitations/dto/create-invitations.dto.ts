import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateInvitationDto {
  @ApiProperty({ example: 'newuser@example.com' })
  @IsEmail()
  emai!:string;

  @ApiProperty({ example: 'New User' })
  @IsString()
  name!:string;
}