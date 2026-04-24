import { PaginationMeta, QueryOptions } from '../../shared/types/pagination.types';

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface RepositoryInterface<T> {
  findById(id: string): Promise<T | null>;
  findAll(queryOptions?: QueryOptions): Promise<PaginatedResponse<T>>;
  create(entity: Partial<T>): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

export interface TenantAwareRepositoryInterface<T> extends RepositoryInterface<T> {
  findByTenantId(tenantId: string, queryOptions?: QueryOptions): Promise<PaginatedResponse<T>>;
  findByIdAndTenant(id: string, tenantId: string): Promise<T | null>;
}

export interface UserRepositoryInterface extends RepositoryInterface<any> {
  findByEmail(email: string, tenantId: string): Promise<any | null>;
  findByTenantId(tenantId: string, queryOptions?: QueryOptions): Promise<PaginatedResponse<any>>;
  updatePassword(id: string, hashedPassword: string): Promise<void>;
  verifyEmail(id: string): Promise<void>;
}

export interface TenantRepositoryInterface extends RepositoryInterface<any> {
  findBySubdomain(subdomain: string): Promise<any | null>;
  findActiveTenants(): Promise<any[]>;
}

export interface RoleRepositoryInterface extends RepositoryInterface<any> {
  findByName(name: string, tenantId: string): Promise<any | null>;
  findSystemRoles(): Promise<any[]>;
}

export interface ProjectRepositoryInterface extends TenantAwareRepositoryInterface<any> {
  findByUserId(userId: string, tenantId: string): Promise<any[]>;
  findByTeamId(teamId: string, tenantId: string): Promise<any[]>;
}

export interface TaskRepositoryInterface extends TenantAwareRepositoryInterface<any> {
  findByProjectId(projectId: string, tenantId: string, queryOptions?: QueryOptions): Promise<PaginatedResponse<any>>;
  findByAssigneeId(assigneeId: string, tenantId: string): Promise<any[]>;
  findByStatus(status: string, tenantId: string): Promise<any[]>;
}

export interface NotificationRepositoryInterface extends TenantAwareRepositoryInterface<any> {
  findUnreadByUserId(userId: string, tenantId: string): Promise<any[]>;
  markAsRead(id: string, userId: string): Promise<void>;
  markAllAsRead(userId: string, tenantId: string): Promise<void>;
}

export interface ActivityLogRepositoryInterface {
  createLog(log: {
    tenantId: string;
    userId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
  }): Promise<any>;
  findByTenant(tenantId: string, queryOptions?: QueryOptions): Promise<PaginatedResponse<any>>;
  findByEntity(entityType: string, entityId: string, tenantId: string): Promise<any[]>;
}