export class DomainException extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = 'DomainException';
  }
}

export class NotFoundException extends DomainException {
  constructor(entity: string, id: string) {
    super(`${entity} with id ${id} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundException';
  }
}

export class ValidationException extends DomainException {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationException';
  }
}

export class ConflictException extends DomainException {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
    this.name = 'ConflictException';
  }
}

export class UnauthorizedException extends DomainException {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedException';
  }
}

export class ForbiddenException extends DomainException {
  constructor(message: string = 'Access denied') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenException';
  }
}

export class TenantException extends DomainException {
  constructor(message: string) {
    super(message, 'TENANT_ERROR', 400);
    this.name = 'TenantException';
  }
}

export class AuthenticationException extends DomainException {
  constructor(message: string = 'Invalid credentials') {
    super(message, 'AUTHENTICATION_FAILED', 401);
    this.name = 'AuthenticationException';
  }
}