import { IsString, IsEmail, IsOptional, MinLength, Matches, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriptionPlan } from '../../../domain/tenant/entities/tenant.entity';

export class CreateTenantDto {
  @ApiProperty({ example: 'acme' })
  @IsString()
  @Matches(/^[a-z0-9-]+$/, { message: 'Subdomain must contain only lowercase letters, numbers, and hyphens' })
  subdomain: string;

  @ApiProperty({ example: 'Acme Corporation' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'admin@acme.com' })
  @IsEmail()
  adminEmail: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8)
  adminPassword: string;

  @ApiPropertyOptional({ enum: SubscriptionPlan })
  @IsOptional()
  @IsEnum(SubscriptionPlan)
  plan?: SubscriptionPlan;
}

export class UpdateTenantDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiPropertyOptional()
  @IsOptional()
  settings?: Record<string, any>;
}

export class TenantResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  subdomain: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  logo?: string;

  @ApiPropertyOptional()
  domain?: string;

  @ApiProperty()
  subscriptionPlan: SubscriptionPlan;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class TenantSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  timezone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  dateFormat?: string;

  @ApiPropertyOptional()
  @IsOptional()
  theme?: string;

  @ApiPropertyOptional()
  @IsOptional()
  features?: Record<string, boolean>;
}