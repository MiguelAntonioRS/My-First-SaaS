import { Injectable } from '@nestjs/common';
import { Team } from '../../domain/team/entities/team.entity';
import { TeamRepository } from './team.repository';

export interface CreateTeamDto {
  name: string;
  description?: string;
  leaderId?: string;
}

export interface UpdateTeamDto {
  name?: string;
  description?: string;
  leaderId?: string;
}

@Injectable()
export class TeamService {
  constructor(private readonly teamRepository: TeamRepository) {}

  async findById(id: string): Promise<Team> {
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new Error('Team not found');
    }
    return team;
  }

  async findByTenantId(tenantId: string, queryOptions?: any): Promise<{ teams: Team[]; total: number }> {
    const teams = await this.teamRepository.findByTenantId(tenantId, queryOptions);
    const total = await this.teamRepository.count(tenantId);
    return { teams, total };
  }

  async create(dto: CreateTeamDto, tenantId: string): Promise<Team> {
    return this.teamRepository.create({
      name: dto.name,
      description: dto.description,
      leaderId: dto.leaderId,
      tenantId,
    });
  }

  async update(id: string, dto: UpdateTeamDto, tenantId: string): Promise<Team | null> {
    const team = await this.findById(id);
    if (team.tenantId !== tenantId) {
      throw new Error('Team not found');
    }
    return this.teamRepository.update(id, dto);
  }
}