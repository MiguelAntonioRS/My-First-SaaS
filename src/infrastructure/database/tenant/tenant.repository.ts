import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant, TenantStatus } from '../../../domain/tenant/entities/tenant.entity';

@Injectable()
export class TenantRepository {
  constructor(
    @InjectRepository(Tenant)
    private readonly repository: Repository<Tenant>,
  ) {}

  async findById(id: string): Promise<Tenant | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findBySubdomain(subdomain: string): Promise<Tenant | null> {
    return this.repository.findOne({
      where: { subdomain, status: TenantStatus.ACTIVE },
    });
  }

  async create(data: Partial<Tenant>): Promise<Tenant> {
    const tenant = this.repository.create(data);
    return this.repository.save(tenant);
  }

  async update(id: string, data: Partial<Tenant>): Promise<Tenant | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async findActiveTenants(): Promise<Tenant[]> {
    return this.repository.find({
      where: { status: TenantStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.update(id, { status: TenantStatus.CANCELLED });
  }
}