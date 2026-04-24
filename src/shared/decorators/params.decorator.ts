import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TenantDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.tenant;
  },
);

export const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const PaginationDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return {
      page: parseInt(request.query.page) || 1,
      limit: parseInt(request.query.limit) || 20,
      sort: request.query.sort || 'createdAt',
      order: request.query.order || 'DESC',
    };
  },
);