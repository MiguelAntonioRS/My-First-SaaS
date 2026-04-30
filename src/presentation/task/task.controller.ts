import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../../infrastructure/authentication/guards/jwt-auth.guard';
import { TenantDecorator, PaginationDecorator } from '../../shared/decorators/params.decorator';
import { Tenant } from '../../domain/tenant/entities/tenant.entity';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'tasks', version: ['1'] })
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  async findAll(@TenantDecorator() tenant: Tenant, @PaginationDecorator() pagination: any) {
    const { tasks, total } = await this.taskService.findByTenantId(tenant.id, pagination);
    return {
      data: tasks,
      meta: { page: pagination.page, limit: pagination.limit, total, totalPages: Math.ceil(total / pagination.limit) },
    };
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get task status summary' })
  async getSummary(@TenantDecorator() tenant: Tenant) {
    return this.taskService.getStatusSummary(tenant.id);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get tasks by project' })
  async findByProject(@Param('projectId') projectId: string) {
    return this.taskService.findByProjectId(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  async findOne(@Param('id') id: string, @TenantDecorator() tenant: Tenant) {
    const task = await this.taskService.findById(id);
    if (!task || task.tenantId !== tenant.id) throw new Error('Task not found');
    return task;
  }

  @Post()
  @ApiOperation({ summary: 'Create new task' })
  async create(@Body() dto: any, @TenantDecorator() tenant: Tenant) {
    return this.taskService.create(dto, tenant.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update task' })
  async update(@Param('id') id: string, @Body() dto: any, @TenantDecorator() tenant: Tenant) {
    return this.taskService.update(id, dto, tenant.id);
  }
}