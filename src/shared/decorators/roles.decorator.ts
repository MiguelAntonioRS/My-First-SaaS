import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

export const CURRENT_USER_KEY = 'currentUser';
export const CurrentUser = () => SetMetadata(CURRENT_USER_KEY, true);

export const TENANT_KEY = 'tenant';
export const TenantOnly = () => SetMetadata(TENANT_KEY, true);