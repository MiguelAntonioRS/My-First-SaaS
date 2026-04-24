export const TENANT_HEADER_KEY = 'x-tenant-id';
export const TENANT_SUBDOMAIN_HEADER = 'x-tenant-subdomain';

export const TENANT_CONTEXT_KEY = 'tenant';
export const USER_CONTEXT_KEY = 'user';

export enum TenantResolutionMode {
  SUBDOMAIN = 'subdomain',
  HEADER = 'header',
  BOTH = 'both',
}