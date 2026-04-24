function orDefault(value: string | undefined, defaultValue: number | string): number | string {
  return value ? (typeof defaultValue === 'number' ? parseInt(value, 10) : value) : defaultValue;
}

export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: orDefault(process.env.PORT, 3000) as number,
  apiPrefix: process.env.API_PREFIX || 'api',
  apiVersion: process.env.API_VERSION || 'v1',
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: orDefault(process.env.DATABASE_PORT, 5432) as number,
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    name: process.env.DATABASE_NAME || 'saas_platform',
    sync: process.env.DATABASE_SYNC === 'true',
    logging: process.env.DATABASE_LOGGING === 'true',
    ssl: process.env.DATABASE_SSL === 'true',
    poolMax: orDefault(process.env.DATABASE_POOL_MAX, 20) as number,
    poolMin: orDefault(process.env.DATABASE_POOL_MIN, 5) as number,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: orDefault(process.env.REDIS_PORT, 6379) as number,
    password: process.env.REDIS_PASSWORD || undefined,
    db: orDefault(process.env.REDIS_DB, 0) as number,
    queueDb: orDefault(process.env.REDIS_QUEUE_DB, 1) as number,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  bcrypt: {
    rounds: orDefault(process.env.BCRYPT_ROUNDS, 12) as number,
  },
  throttle: {
    ttl: orDefault(process.env.RATE_LIMIT_TTL, 60000) as number,
    limit: orDefault(process.env.RATE_LIMIT_MAX, 100) as number,
  },
  tenant: {
    defaultSubdomain: process.env.DEFAULT_TENANT_SUBDOMAIN || 'app',
    resolutionMode: process.env.TENANT_RESOLUTION_MODE || 'subdomain',
  },
  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') || ['*'],
  },
  storage: {
    path: process.env.STORAGE_PATH || './uploads',
    maxSize: orDefault(process.env.STORAGE_MAX_SIZE, 10485760) as number,
  },
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    format: process.env.LOG_FORMAT || 'json',
  },
});