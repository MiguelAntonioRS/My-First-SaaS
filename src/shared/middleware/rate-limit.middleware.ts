import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RedisService } from '../../infrastructure/cache/redis.service';

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly defaultOptions: RateLimitOptions = {
    windowMs: 60000,
    maxRequests: 100,
    keyPrefix: 'rate_limit',
  };

  constructor(private readonly redisService: RedisService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const options = this.defaultOptions;
    const identifier = this.getIdentifier(req);
    const key = `${options.keyPrefix}:${identifier}`;

    const current = await this.redisService.get(key);
    const currentCount = current ? parseInt(current) : 0;

    if (currentCount >= options.maxRequests) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests, please try again later.',
          code: 'RATE_LIMIT_EXCEEDED',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const ttl = await this.redisService.increment(key);
    if (ttl === 1) {
      await this.redisService.expire(key, Math.ceil(options.windowMs / 1000));
    }

    const remaining = Math.max(0, options.maxRequests - ttl);
    res.setHeader('X-RateLimit-Limit', options.maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', new Date(Date.now() + options.windowMs).toISOString());

    next();
  }

  private getIdentifier(req: Request): string {
    return req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
  }
}