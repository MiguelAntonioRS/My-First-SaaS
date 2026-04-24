import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from '../../domain/team/entities/team.entity';
import { TeamService } from './team.service';
import { TeamRepository } from './team.repository';
import { TeamController } from './team.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Team])],
  controllers: [TeamController],
  providers: [TeamService, TeamRepository],
  exports: [TeamService],
})
export class TeamModule {}