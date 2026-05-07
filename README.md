# SaaS Multi-tenant Platform

## Overview
  
A production-ready multi-tenant SaaS platform built with NestJS, TypeORM, PostgreSQL, and Redis. This platform provides a complete organizational management system with user management, role-based access control, project management, and task tracking.

## Architecture 

The platform follows **Clean Architecture** principles with **Domain-Driven Design (DDD)** patterns, organized into distinct layers:
 
``` 
src/
├── domain/           # Business entities, value objects, and domain logic
│   ├── common/       # Shared domain concepts (exceptions, events, interfaces)
│   ├── tenant/       # Tenant entity 
│   ├── user/         # User and Role entities
│   ├── team/         # Team entity
│   ├── project/      # Project entity
│   ├── task/         # Task entity
│   ├── notification/ # Notification entity
│   ├── activity/     # Activity log entity
│   └── subscription/ # Subscription and invoice entities
├── application/      # Use cases, DTOs, and application services
│   └── dto/          # Data transfer objects
├── infrastructure/    # External concerns implementation
│   ├── authentication/ # JWT, password hashing
│   ├── cache/        # Redis implementation
│   └── database/     # TypeORM repositories
└── presentation/    # API layer (controllers, routes, middleware)
    ├── auth/         # Authentication endpoints
    ├── user/         # User management
    ├── team/         # Team management
    ├── project/      # Project management
    ├── task/         # Task management
    └── authorization/ # Roles and permissions
```

## Features

### Multi-tenancy
- **Subdomain-based tenant resolution**: `company1.app.com`, `company2.app.com`
- **Header-based tenant identification**: `X-Tenant-ID` header support
- Complete data isolation per tenant
- Tenant-specific settings and preferences

### Authentication & Authorization
- JWT-based authentication with access/refresh tokens
- Role-Based Access Control (RBAC)
- Granular permission system
- Secure password hashing with bcrypt

### Modules

1. **Authentication** (`/api/v1/auth`)
   - Login: `POST /api/v1/auth/login`
   - Register: `POST /api/v1/auth/register`
   - Refresh: `POST /api/v1/auth/refresh`
   - Logout: `POST /api/v1/auth/logout`

2. **Users** (`/api/v1/users`)
   - CRUD operations
   - Profile management
   - Password change

3. **Teams** (`/api/v1/teams`)
   - Team creation and management
   - Member assignment

4. **Projects** (`/api/v1/projects`)
   - Project CRUD
   - Statistics and metrics
   - Member/team assignment

5. **Tasks** (`/api/v1/tasks`)
   - Task management
   - Status workflow
   - Assignment system
   - Priority levels

6. **Roles & Permissions** (`/api/v1/roles`)
   - Custom role creation
   - Permission management
   - System role seeding

## Technology Stack

- **Runtime**: Node.js 20+
- **Framework**: NestJS 10
- **Language**: TypeScript 5
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **ORM**: TypeORM
- **Authentication**: JWT (Passport)
- **API Documentation**: Swagger/OpenAPI
- **Queue**: Bull (Redis-based)

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- Docker & Docker Compose (optional)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd saas-platform

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
```

### Development

```bash
# Start with Docker Compose (recommended)
docker-compose -f docker-compose.dev.yml up -d

# Or run locally
# Start PostgreSQL and Redis
npm run start:dev
```

### Production

```bash
# Build the application
npm run build

# Run migrations
npm run migration:run

# Seed database
npm run seed

# Start production
npm run start:prod
```

## API Documentation

Once running, access the Swagger documentation at:
- Development: `http://localhost:3000/docs`
- Production: `https://yourdomain.com/docs`

## API Examples

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@default.com", "password": "Admin123!"}'
```

### Create Project
```bash
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Project", "description": "Project description"}'
```

## Database Schema

### Key Tables
- `tenants` - Organization/tenant data
- `users` - User accounts with tenant association
- `roles` - Role definitions with permissions
- `teams` - Team groupings
- `projects` - Project management
- `tasks` - Task tracking
- `activity_logs` - Audit trail
- `notifications` - User notifications

## Security Features

- JWT token expiration and refresh
- Password hashing with bcrypt (12 rounds)
- Rate limiting (configurable)
- Input validation with class-validator
- CORS configuration
- SQL injection prevention via TypeORM
- Audit logging

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Application port | `3000` |
| `DATABASE_HOST` | PostgreSQL host | `localhost` |
| `DATABASE_PORT` | PostgreSQL port | `5432` |
| `DATABASE_NAME` | Database name | `saas_platform` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | Token expiration | `1h` |

## Default Credentials

After seeding the database:
- **Admin**: `admin@default.com` / `Admin123!`
- **Employee**: `employee@default.com` / `Employee123!`

## License

MIT