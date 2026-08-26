import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateInvitationDto {
  @ApiProperty({ example: 'newuser@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'New User' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'ADMIN', description: 'Role to assign to the user in the team' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({ example: 'team-id-here', description: 'Team ID to add the user to' })
  @IsString()
  @IsNotEmpty()
  teamId!: string;
}