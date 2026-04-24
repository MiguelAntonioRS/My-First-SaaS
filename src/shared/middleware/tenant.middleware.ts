import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from '../../infrastructure/database/tenant/tenant.service';
import { TENANT_HEADER_KEY, TENANT_CONTEXT_KEY } from '../constants/tenant.constants';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantService: TenantService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers[TENANT_HEADER_KEY] as string;
    const subdomain = req.subdomains?.[0];

    if (tenantId) {
      const tenant = await this.tenantService.findById(tenantId);
      if (tenant) {
        (req as any)[TENANT_CONTEXT_KEY] = tenant;
        return next();
      }
    }

    if (subdomain) {
      const tenant = await this.tenantService.findBySubdomain(subdomain);
      if (tenant) {
        (req as any)[TENANT_CONTEXT_KEY] = tenant;
        return next();
      }
    }

    const publicRoutes = [
      '/api/v1/auth/login',
      '/api/v1/auth/register',
      '/api/v1/auth/forgot-password',
      '/api/v1/health',
      '/docs',
    ];

    const isPublicRoute = publicRoutes.some((route) =>
      req.path.startsWith(route),
    );

    if (!isPublicRoute && req.path.startsWith('/api/')) {
      throw new UnauthorizedException('Tenant identification required');
    }

    next();
  }
}