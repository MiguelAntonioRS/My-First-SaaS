import { Injectable } from '@nestjs/common';
import { Project } from '../../domain/project/entities/project.entity';
import { ProjectRepository } from './project.repository';

export interface CreateProjectDto {
  name: string;
  description?: string;
  key?: string;
  startDate?: Date;
  endDate?: Date;
  priority?: string;
  ownerId?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: string;
  priority?: string;
  startDate?: Date;
  endDate?: Date;
  ownerId?: string;
}

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async findById(id: string): Promise<Project | null> {
    return this.projectRepository.findById(id);
  }

  async findByTenantId(tenantId: string, queryOptions?: any): Promise<{ projects: Project[]; total: number }> {
    const projects = await this.projectRepository.findByTenantId(tenantId, queryOptions);
    const total = await this.projectRepository.count(tenantId);
    return { projects, total };
  }

  async create(dto: CreateProjectDto, tenantId: string): Promise<Project> {
    const key = dto.key || Math.random().toString(36).substring(0, 4).toUpperCase();
    return this.projectRepository.create({
      name: dto.name,
      description: dto.description,
      key,
      startDate: dto.startDate,
      endDate: dto.endDate,
      priority: dto.priority as any || 'medium',
      status: 'planning' as any,
      ownerId: dto.ownerId,
      tenantId,
    });
  }

  async update(id: string, dto: UpdateProjectDto, tenantId: string): Promise<Project | null> {
    const project = await this.findById(id);
    if (!project || project.tenantId !== tenantId) {
      throw new Error('Project not found');
    }
    return this.projectRepository.update(id, dto as any);
  }
}