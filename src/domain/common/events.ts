export interface DomainEvent {
  eventType: string;
  occurredOn: Date;
  aggregateId: string;
  tenantId: string;
}

export class UserCreatedEvent implements DomainEvent {
  eventType = 'UserCreated';
  occurredOn = new Date();

  constructor(
    public aggregateId: string,
    public tenantId: string,
    public email: string,
    public firstName: string,
    public lastName: string,
  ) {}
}

export class UserActivatedEvent implements DomainEvent {
  eventType = 'UserActivated';
  occurredOn = new Date();

  constructor(
    public aggregateId: string,
    public tenantId: string,
  ) {}
}

export class ProjectCreatedEvent implements DomainEvent {
  eventType = 'ProjectCreated';
  occurredOn = new Date();

  constructor(
    public aggregateId: string,
    public tenantId: string,
    public name: string,
    public ownerId: string,
  ) {}
}

export class TaskAssignedEvent implements DomainEvent {
  eventType = 'TaskAssigned';
  occurredOn = new Date();

  constructor(
    public aggregateId: string,
    public tenantId: string,
    public taskId: string,
    public assigneeId: string,
  ) {}
}

export class TaskCompletedEvent implements DomainEvent {
  eventType = 'TaskCompleted';
  occurredOn = new Date();

  constructor(
    public aggregateId: string,
    public tenantId: string,
    public taskId: string,
    public completedBy: string,
  ) {}
}

export class TenantCreatedEvent implements DomainEvent {
  eventType = 'TenantCreated';
  occurredOn = new Date();

  constructor(
    public aggregateId: string,
    public tenantId: string,
    public name: string,
    public subdomain: string,
  ) {}
}