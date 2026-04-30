import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../../infrastructure/authentication/guards/jwt-auth.guard';
import { TenantDecorator, PaginationDecorator } from '../../shared/decorators/params.decorator';
import { Tenant } from '../../domain/tenant/entities/tenant.entity';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'projects', version: ['1'] })
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  async findAll(@TenantDecorator() tenant: Tenant, @PaginationDecorator() pagination: any) {
    const { projects, total } = await this.projectService.findByTenantId(tenant.id, pagination);
    return {
      data: projects,
      meta: { page: pagination.page, limit: pagination.limit, total, totalPages: Math.ceil(total / pagination.limit) },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  async findOne(@Param('id') id: string, @TenantDecorator() tenant: Tenant) {
    const project = await this.projectService.findById(id);
    if (!project || project.tenantId !== tenant.id) throw new Error('Project not found');
    return project;
  }

  @Post()
  @ApiOperation({ summary: 'Create new project' })
  async create(@Body() dto: any, @TenantDecorator() tenant: Tenant) {
    return this.projectService.create(dto, tenant.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update project' })
  async update(@Param('id') id: string, @Body() dto: any, @TenantDecorator() tenant: Tenant) {
    return this.projectService.update(id, dto, tenant.id);
  }
}