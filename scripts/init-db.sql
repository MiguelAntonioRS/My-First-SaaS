CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "tenants" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "subdomain" varchar UNIQUE NOT NULL,
    "name" varchar NOT NULL,
    "status" varchar DEFAULT 'active',
    "createdAt" timestamp DEFAULT NOW()
);

INSERT INTO "tenants" ("subdomain", "name", "status") 
VALUES ('default', 'Default Organization', 'active')
ON CONFLICT ("subdomain") DO NOTHING;