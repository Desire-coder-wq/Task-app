import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsDateString, IsNotEmpty } from 'class-validator';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export class CreateTaskDto {
  @ApiProperty({ example: 'Design dashboard layout', description: 'Task title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Create responsive dashboard with sidebar', description: 'Task description' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ enum: TaskStatus, example: 'TODO' })
  @IsEnum(TaskStatus)
  status!: TaskStatus;

  @ApiProperty({ enum: TaskPriority, example: 'MEDIUM' })
  @IsEnum(TaskPriority)
  priority!: TaskPriority;

  @ApiProperty({ example: '2026-09-01', description: 'Due date' })
  @IsDateString()
  dueDate!: string;

  @ApiProperty({ example: 'user-id', description: 'Assigned user ID' })
  @IsString()
  @IsNotEmpty()
  assignedUserId!: string;
}