import { IsString, IsOptional, IsUUID, IsArray, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement user authentication' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Add login and registration functionality' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  parentTaskId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum({})
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum({})
  priority?: string;

  @ApiPropertyOptional()
  @IsOptional()
  estimatedHours?: number;

  @ApiPropertyOptional()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  dueDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  assigneeIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  teamIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString()
  labels?: string[];
}

export class UpdateTaskDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum({})
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum({})
  priority?: string;

  @ApiPropertyOptional()
  @IsOptional()
  estimatedHours?: number;

  @ApiPropertyOptional()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  dueDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString()
  labels?: string[];
}

export class TaskResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  taskNumber?: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  priority: string;

  @ApiPropertyOptional()
  estimatedHours?: number;

  @ApiPropertyOptional()
  actualHours?: number;

  @ApiPropertyOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  dueDate?: Date;

  @ApiPropertyOptional()
  completedAt?: Date;

  @ApiPropertyOptional()
  assignee?: any;

  @ApiPropertyOptional()
  project?: any;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class TaskFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  teamId?: string;
}