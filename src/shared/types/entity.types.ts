export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantAwareEntity extends BaseEntity {
  tenantId: string;
}

export interface UserAwareEntity extends BaseEntity {
  tenantId: string;
  createdById: string;
}

export interface SoftDeletableEntity extends BaseEntity {
  deletedAt: Date | null;
}

export interface TimestampOnlyEntity {
  createdAt: Date;
  updatedAt: Date;
}