import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  async get(key: string): Promise<string | null> {
    this.logger.debug(`Redis GET (mock): ${key}`);
    return null;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    this.logger.debug(`Redis SET (mock): ${key}`);
  }

  async del(key: string): Promise<void> {
    this.logger.debug(`Redis DEL (mock): ${key}`);
  }

  async exists(key: string): Promise<boolean> {
    return false;
  }

  async keys(pattern: string): Promise<string[]> {
    return [];
  }

  async setHash(key: string, field: string, value: string): Promise<void> {}
  async getHash(key: string, field: string): Promise<string | null> { return null; }
  async getAllHash(key: string): Promise<Record<string, string>> { return {}; }
  async increment(key: string): Promise<number> { return 0; }
  async expire(key: string, seconds: number): Promise<void> {}

  publish(channel: string, message: string): Promise<number> {
    return Promise.resolve(0);
  }

  subscribe(channel: string, callback: (message: string) => void): void {
    this.logger.debug(`Redis SUBSCRIBE (mock): ${channel}`);
  }
}