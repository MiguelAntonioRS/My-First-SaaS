import { Module, Global, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import configuration from './shared/config/configuration';
import { TenantModule } from './infrastructure/database/tenant/tenant.module';
import { RedisModule } from './infrastructure/cache/redis.module';
import { AuthPresentationModule } from './presentation/auth/auth.module';
import { UserModule } from './presentation/user/user.module';
import { TeamModule } from './presentation/team/team.module';
import { ProjectModule } from './presentation/project/project.module';
import { TaskModule } from './presentation/task/task.module';
import { TenantMiddleware } from './shared/middleware/tenant.middleware';
import { HealthModule } from './shared/health/health.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/domain/**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('DATABASE_SYNC', false),
        logging: configService.get<boolean>('DATABASE_LOGGING', false),
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('RATE_LIMIT_TTL', 60000),
            limit: config.get<number>('RATE_LIMIT_MAX', 100),
          },
        ],
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    RedisModule,
    TenantModule,
    HealthModule,
    AuthPresentationModule,
    UserModule,
    TeamModule,
    ProjectModule,
    TaskModule,
  ],
  exports: [TypeOrmModule, RedisModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}