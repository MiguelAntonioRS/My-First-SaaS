export class TenantId {
  constructor(private readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('TenantId cannot be empty');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: TenantId): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}

export class UserId {
  constructor(private readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('UserId cannot be empty');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UserId): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}

export class Email {
  constructor(private readonly value: string) {
    if (!this.isValidEmail(value)) {
      throw new Error('Invalid email format');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value.toLowerCase() === other.getValue().toLowerCase();
  }

  toString(): string {
    return this.value;
  }
}

export class Password {
  constructor(private readonly value: string) {
    if (value.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Password): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}