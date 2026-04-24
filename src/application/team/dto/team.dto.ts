import { IsString, IsOptional, IsUUID, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({ example: 'Frontend Team' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Team responsible for frontend development' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  leaderId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  memberIds?: string[];
}

export class UpdateTeamDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  leaderId?: string;
}

export class TeamResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  avatar?: string;

  @ApiPropertyOptional()
  leader?: any;

  @ApiProperty()
  membersCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class AddTeamMembersDto {
  @ApiProperty()
  @IsArray()
  @IsUUID('4', { each: true })
  userIds: string[];
}

export class RemoveTeamMembersDto {
  @ApiProperty()
  @IsArray()
  @IsUUID('4', { each: true })
  userIds: string[];
}