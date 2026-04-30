import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus, ProjectPriority } from '../../domain/project/entities/project.entity';

@Injectable()
export class ProjectRepository {
  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>,
  ) {}

  async findById(id: string): Promise<Project | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByTenantId(tenantId: string, queryOptions?: any): Promise<Project[]> {
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

  async create(data: Partial<Project>): Promise<Project> {
    const project = this.repository.create(data);
    return this.repository.save(project);
  }

  async update(id: string, data: Partial<Project>): Promise<Project | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }
}