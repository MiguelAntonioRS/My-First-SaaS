import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../../domain/team/entities/team.entity';

@Injectable()
export class TeamRepository {
  constructor(
    @InjectRepository(Team)
    private readonly repository: Repository<Team>,
  ) {}

  async findById(id: string): Promise<Team | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByTenantId(tenantId: string, queryOptions?: any): Promise<Team[]> {
    const { page = 1, limit = 20, sort = 'createdAt', order = 'DESC' } = queryOptions || {};
    
    return this.repository.find({
      where: { tenantId },
      skip: (page - 1) * limit,
      take: limit,
      order: { [sort]: order },
    });
  }

  async count(tenantId: string): Promise<number> {
    return this.repository.count({ where: { tenantId } });
  }

  async create(data: Partial<Team>): Promise<Team> {
    const team = this.repository.create(data);
    return this.repository.save(team);
  }

  async update(id: string, data: Partial<Team>): Promise<Team | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }
}