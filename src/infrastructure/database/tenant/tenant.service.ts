import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../../../domain/tenant/entities/tenant.entity';
import { TenantRepository } from './tenant.repository';

@Injectable()
export class TenantService {
  constructor(
    private readonly tenantRepository: TenantRepository,
  ) {}

  async findById(id: string): Promise<Tenant | null> {
    return this.tenantRepository.findById(id);
  }

  async findBySubdomain(subdomain: string): Promise<Tenant | null> {
    return this.tenantRepository.findBySubdomain(subdomain);
  }

  async create(data: Partial<Tenant>): Promise<Tenant> {
    return this.tenantRepository.create(data);
  }

  async update(id: string, data: Partial<Tenant>): Promise<Tenant | null> {
    return this.tenantRepository.update(id, data);
  }

  async findActiveTenants(): Promise<Tenant[]> {
    return this.tenantRepository.findActiveTenants();
  }
}