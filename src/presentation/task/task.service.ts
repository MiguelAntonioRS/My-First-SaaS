import { Injectable } from '@nestjs/common';
import { Task } from '../../domain/task/entities/task.entity';
import { TaskRepository } from './task.repository';

export interface CreateTaskDto {
  title: string;
  description?: string;
  projectId?: string;
  priority?: string;
  estimatedHours?: number;
  startDate?: Date;
  dueDate?: Date;
  assigneeId?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  estimatedHours?: number;
  startDate?: Date;
  dueDate?: Date;
  assigneeId?: string;
}

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async findById(id: string): Promise<Task | null> {
    return this.taskRepository.findById(id);
  }

  async findByTenantId(tenantId: string, queryOptions?: any): Promise<{ tasks: Task[]; total: number }> {
    const tasks = await this.taskRepository.findByTenantId(tenantId, queryOptions);
    const total = await this.taskRepository.count(tenantId);
    return { tasks, total };
  }

  async findByProjectId(projectId: string): Promise<Task[]> {
    return this.taskRepository.findByProjectId(projectId);
  }

  async getStatusSummary(tenantId: string): Promise<Record<string, number>> {
    return this.taskRepository.countByStatus(tenantId);
  }

  async create(dto: CreateTaskDto, tenantId: string): Promise<Task> {
    return this.taskRepository.create({
      title: dto.title,
      description: dto.description,
      projectId: dto.projectId,
      status: 'todo' as any,
      priority: dto.priority as any || 'medium',
      estimatedHours: dto.estimatedHours || 0,
      startDate: dto.startDate,
      dueDate: dto.dueDate,
      assigneeId: dto.assigneeId,
      tenantId,
    });
  }

  async update(id: string, dto: UpdateTaskDto, tenantId: string): Promise<Task | null> {
    const task = await this.findById(id);
    if (!task || task.tenantId !== tenantId) {
      throw new Error('Task not found');
    }
    return this.taskRepository.update(id, dto as any);
  }
}