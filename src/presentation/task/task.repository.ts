import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus, TaskPriority } from '../../domain/task/entities/task.entity';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly repository: Repository<Task>,
  ) {}

  async findById(id: string): Promise<Task | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByTenantId(tenantId: string, queryOptions?: any): Promise<Task[]> {
    const { page = 1, limit = 20 } = queryOptions || {};
    return this.repository.find({
      where: { tenantId },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async findByProjectId(projectId: string): Promise<Task[]> {
    return this.repository.find({
      where: { projectId },
    });
  }

  async count(tenantId: string): Promise<number> {
    return this.repository.count({ where: { tenantId } });
  }

  async countByStatus(tenantId: string): Promise<Record<string, number>> {
    const tasks = await this.findByTenantId(tenantId);
    return {
      todo: tasks.filter(t => t.status === TaskStatus.TODO).length,
      in_progress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
      done: tasks.filter(t => t.status === TaskStatus.DONE).length,
    };
  }

  async create(data: Partial<Task>): Promise<Task> {
    const task = this.repository.create(data);
    return this.repository.save(task);
  }

  async update(id: string, data: Partial<Task>): Promise<Task | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }
}