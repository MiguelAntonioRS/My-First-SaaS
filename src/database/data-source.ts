import { DataSource } from 'typeorm';
import { Tenant } from '../domain/tenant/entities/tenant.entity';
import { User } from '../domain/user/entities/user.entity';
import { Role } from '../domain/user/entities/role.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'saas_platform',
  entities: [
    Tenant,
    User,
    Role,
  ],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});