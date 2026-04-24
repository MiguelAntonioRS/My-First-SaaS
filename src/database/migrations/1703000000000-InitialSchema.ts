import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1703000000000 implements MigrationInterface {
  name = 'InitialSchema1703000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create extension for UUID
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Tenants table
    await queryRunner.query(`
      CREATE TYPE "subscription_plan_enum" AS ENUM ('free', 'starter', 'professional', 'enterprise')
    `);
    await queryRunner.query(`
      CREATE TYPE "tenant_status_enum" AS ENUM ('active', 'suspended', 'pending', 'cancelled')
    `);
    await queryRunner.query(`
      CREATE TABLE "tenants" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "subdomain" character varying NOT NULL,
        "name" character varying NOT NULL,
        "logo" character varying,
        "domain" character varying,
        "subscriptionPlan" "subscription_plan_enum" NOT NULL DEFAULT 'free',
        "status" "tenant_status_enum" NOT NULL DEFAULT 'pending',
        "settings" jsonb,
        "metadata" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_tenants_subdomain" UNIQUE ("subdomain"),
        PRIMARY KEY ("id")
      )
    `);

    // Roles table (created before users because users references roles)
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL,
        "name" character varying NOT NULL,
        "displayName" character varying NOT NULL,
        "description" text,
        "permissions" jsonb NOT NULL DEFAULT '[]',
        "priority" integer NOT NULL DEFAULT 0,
        "isSystem" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_roles_name_tenant" UNIQUE ("name", "tenantId"),
        PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_roles_tenantId" ON "roles" ("tenantId")`);

    // Users table
    await queryRunner.query(`
      CREATE TYPE "user_status_enum" AS ENUM ('active', 'inactive', 'pending', 'suspended')
    `);
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "avatar" character varying,
        "phone" character varying,
        "jobTitle" character varying,
        "status" "user_status_enum" NOT NULL DEFAULT 'active',
        "roleId" uuid,
        "preferences" jsonb,
        "metadata" jsonb,
        "lastLoginAt" TIMESTAMP,
        "emailVerifiedAt" TIMESTAMP,
        "passwordChangedAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email_tenant" UNIQUE ("email", "tenantId"),
        PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_users_tenantId" ON "users" ("tenantId")`);
    await queryRunner.query(`CREATE INDEX "idx_users_email" ON "users" ("email")`);

    // Add foreign keys after tables are created
    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_users_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_users_role" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL`);
    await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_roles_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE`);

    // Teams table
    await queryRunner.query(`
      CREATE TABLE "teams" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL,
        "name" character varying NOT NULL,
        "description" text,
        "avatar" character varying,
        "leaderId" uuid,
        "metadata" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        PRIMARY KEY ("id"),
        CONSTRAINT "FK_teams_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_teams_leader" FOREIGN KEY ("leaderId") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    // Team members junction table
    await queryRunner.query(`
      CREATE TABLE "team_members" (
        "teamId" uuid NOT NULL,
        "userId" uuid NOT NULL,
        PRIMARY KEY ("teamId", "userId"),
        CONSTRAINT "FK_team_members_team" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_team_members_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Projects table
    await queryRunner.query(`
      CREATE TYPE "project_status_enum" AS ENUM ('planning', 'active', 'on_hold', 'completed', 'archived')
    `);
    await queryRunner.query(`
      CREATE TYPE "project_priority_enum" AS ENUM ('low', 'medium', 'high', 'critical')
    `);
    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL,
        "name" character varying NOT NULL,
        "description" text,
        "key" character varying,
        "status" "project_status_enum" NOT NULL DEFAULT 'planning',
        "priority" "project_priority_enum" NOT NULL DEFAULT 'medium',
        "startDate" TIMESTAMP,
        "endDate" TIMESTAMP,
        "ownerId" uuid,
        "settings" jsonb,
        "metadata" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        PRIMARY KEY ("id"),
        CONSTRAINT "FK_projects_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_projects_owner" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    // Project members and teams junction tables
    await queryRunner.query(`
      CREATE TABLE "project_members" (
        "projectId" uuid NOT NULL,
        "userId" uuid NOT NULL,
        PRIMARY KEY ("projectId", "userId"),
        CONSTRAINT "FK_project_members_project" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_project_members_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "project_teams" (
        "projectId" uuid NOT NULL,
        "teamId" uuid NOT NULL,
        PRIMARY KEY ("projectId", "teamId"),
        CONSTRAINT "FK_project_teams_project" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_project_teams_team" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE
      )
    `);

    // Tasks table
    await queryRunner.query(`
      CREATE TYPE "task_status_enum" AS ENUM ('todo', 'in_progress', 'in_review', 'done', 'cancelled')
    `);
    await queryRunner.query(`
      CREATE TYPE "task_priority_enum" AS ENUM ('low', 'medium', 'high', 'urgent')
    `);
    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL,
        "projectId" uuid,
        "parentTaskId" uuid,
        "title" character varying NOT NULL,
        "description" text,
        "taskNumber" character varying,
        "status" "task_status_enum" NOT NULL DEFAULT 'todo',
        "priority" "task_priority_enum" NOT NULL DEFAULT 'medium',
        "estimatedHours" integer NOT NULL DEFAULT 0,
        "actualHours" integer NOT NULL DEFAULT 0,
        "startDate" TIMESTAMP,
        "dueDate" TIMESTAMP,
        "completedAt" TIMESTAMP,
        "assigneeId" uuid,
        "reporterId" uuid,
        "labels" jsonb,
        "attachments" jsonb,
        "customFields" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        PRIMARY KEY ("id"),
        CONSTRAINT "FK_tasks_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_tasks_project" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_tasks_parent" FOREIGN KEY ("parentTaskId") REFERENCES "tasks"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_tasks_assignee" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_tasks_reporter" FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    // Task assignees and teams junction tables
    await queryRunner.query(`
      CREATE TABLE "task_assignees" (
        "taskId" uuid NOT NULL,
        "userId" uuid NOT NULL,
        PRIMARY KEY ("taskId", "userId"),
        CONSTRAINT "FK_task_assignees_task" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_task_assignees_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "task_teams" (
        "taskId" uuid NOT NULL,
        "teamId" uuid NOT NULL,
        PRIMARY KEY ("taskId", "teamId"),
        CONSTRAINT "FK_task_teams_task" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_task_teams_team" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE
      )
    `);

    // Activity logs table
    await queryRunner.query(`
      CREATE TYPE "activity_type_enum" AS ENUM ('create', 'update', 'delete', 'login', 'logout', 'invite', 'assign', 'complete')
    `);
    await queryRunner.query(`
      CREATE TABLE "activity_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL,
        "userId" uuid,
        "action" "activity_type_enum" NOT NULL,
        "entityType" character varying NOT NULL,
        "entityId" uuid,
        "oldValues" jsonb,
        "newValues" jsonb,
        "ipAddress" character varying,
        "userAgent" character varying,
        "metadata" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        PRIMARY KEY ("id"),
        CONSTRAINT "FK_activity_logs_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_activity_logs_tenantId" ON "activity_logs" ("tenantId")`);

    // Notifications table
    await queryRunner.query(`
      CREATE TYPE "notification_type_enum" AS ENUM ('task_assigned', 'task_completed', 'task_updated', 'project_invite', 'team_invite', 'mention', 'comment', 'deadline_reminder', 'system')
    `);
    await queryRunner.query(`
      CREATE TYPE "notification_channel_enum" AS ENUM ('in_app', 'email', 'push')
    `);
    await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL,
        "userId" uuid NOT NULL,
        "type" "notification_type_enum" NOT NULL,
        "title" character varying NOT NULL,
        "message" text NOT NULL,
        "data" jsonb,
        "isRead" boolean NOT NULL DEFAULT false,
        "readAt" TIMESTAMP,
        "channels" "notification_channel_enum"[] NOT NULL DEFAULT '{in_app}',
        "scheduledFor" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        PRIMARY KEY ("id"),
        CONSTRAINT "FK_notifications_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_notifications_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Subscriptions table
    await queryRunner.query(`
      CREATE TYPE "subscription_status_enum" AS ENUM ('active', 'past_due', 'cancelled', 'paused')
    `);
    await queryRunner.query(`
      CREATE TABLE "subscriptions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL,
        "plan" character varying NOT NULL,
        "status" "subscription_status_enum" NOT NULL DEFAULT 'active',
        "price" decimal NOT NULL,
        "currency" character varying NOT NULL,
        "interval" character varying NOT NULL,
        "startDate" TIMESTAMP NOT NULL,
        "endDate" TIMESTAMP NOT NULL,
        "cancelledAt" TIMESTAMP,
        "stripeSubscriptionId" character varying,
        "metadata" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        PRIMARY KEY ("id"),
        CONSTRAINT "FK_subscriptions_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE
      )
    `);

    // Invoices table
    await queryRunner.query(`
      CREATE TABLE "invoices" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL,
        "subscriptionId" uuid NOT NULL,
        "amount" decimal NOT NULL,
        "currency" character varying NOT NULL,
        "status" character varying NOT NULL,
        "stripeInvoiceId" character varying,
        "paidAt" TIMESTAMP,
        "dueDate" TIMESTAMP,
        "metadata" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        PRIMARY KEY ("id"),
        CONSTRAINT "FK_invoices_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_invoices_subscription" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE
      )
    `);

    // Permissions table
    await queryRunner.query(`
      CREATE TYPE "permission_group_enum" AS ENUM ('users', 'teams', 'projects', 'tasks', 'reports', 'settings', 'admin')
    `);
    await queryRunner.query(`
      CREATE TABLE "permissions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL UNIQUE,
        "displayName" character varying NOT NULL,
        "description" text,
        "group" "permission_group_enum" NOT NULL DEFAULT 'users',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "invoices"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "subscriptions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "notifications"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "notification_channel_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "notification_type_enum"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "activity_logs"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "activity_type_enum"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "task_teams"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "task_assignees"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tasks"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "task_priority_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "task_status_enum"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "project_teams"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "project_members"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "projects"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "project_priority_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "project_status_enum"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "team_members"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "teams"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "roles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_status_enum"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tenants"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "tenant_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "subscription_plan_enum"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "permissions"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "permission_group_enum"`);
  }
}