import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthCheckResult,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DatabaseHealthIndicator } from './database.health';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private databaseHealthIndicator: DatabaseHealthIndicator,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Check application health status' })
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.databaseHealthIndicator.isHealthy('database'),
    ]);
  }
}