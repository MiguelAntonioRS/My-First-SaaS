import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'project_manager' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Project Manager' })
  @IsString()
  displayName: string;

  @ApiPropertyOptional({ example: 'Can manage projects and assign tasks' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}

export class UpdateRoleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}

export class RoleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  displayName: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  permissions: string[];

  @ApiProperty()
  priority: number;

  @ApiProperty()
  isSystem: boolean;

  @ApiProperty()
  createdAt: Date;
}

export class AssignRoleDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  roleId: string;
}

export class PermissionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  displayName: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  group: string;
}