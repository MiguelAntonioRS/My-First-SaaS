import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TeamService } from './team.service';
import { JwtAuthGuard } from '../../infrastructure/authentication/guards/jwt-auth.guard';
import { TenantDecorator, PaginationDecorator } from '../../shared/decorators/params.decorator';
import { Tenant } from '../../domain/tenant/entities/tenant.entity';

@ApiTags('teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'teams', version: ['1'] })
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @ApiOperation({ summary: 'Get all teams' })
  async findAll(@TenantDecorator() tenant: Tenant, @PaginationDecorator() pagination: any) {
    const { teams, total } = await this.teamService.findByTenantId(tenant.id, pagination);
    return {
      data: teams,
      meta: { page: pagination.page, limit: pagination.limit, total, totalPages: Math.ceil(total / pagination.limit) },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get team by ID' })
  async findOne(@Param('id') id: string, @TenantDecorator() tenant: Tenant) {
    const team = await this.teamService.findById(id);
    if (team.tenantId !== tenant.id) throw new Error('Team not found');
    return team;
  }

  @Post()
  @ApiOperation({ summary: 'Create new team' })
  async create(@Body() dto: any, @TenantDecorator() tenant: Tenant) {
    return this.teamService.create(dto, tenant.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update team' })
  async update(@Param('id') id: string, @Body() dto: any, @TenantDecorator() tenant: Tenant) {
    return this.teamService.update(id, dto, tenant.id);
  }
}