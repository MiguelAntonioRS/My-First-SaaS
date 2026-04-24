import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '../../../domain/tenant/entities/tenant.entity';
import { TenantService } from './tenant.service';
import { TenantRepository } from './tenant.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [TenantService, TenantRepository],
  exports: [TenantService],
})
export class TenantModule {}