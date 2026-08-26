import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'My Awesome Team' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'This team handles all development projects', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}