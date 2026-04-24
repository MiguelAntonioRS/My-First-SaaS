import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Tenant } from '../../domain/tenant/entities/tenant.entity';
import { User, UserStatus } from '../../domain/user/entities/user.entity';
import { Role } from '../../domain/user/entities/role.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'saas_platform',
  entities: [Tenant, User, Role],
  synchronize: false,
});

async function seed() {
  console.log('Starting database seeding...');

  await dataSource.initialize();
  console.log('Database connection established');

  const tenantRepository = dataSource.getRepository(Tenant);
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);

  // Create default tenant
  const existingTenant = await tenantRepository.findOne({ where: { subdomain: 'default' } });
  let tenant: Tenant;

  if (existingTenant) {
    tenant = existingTenant;
    console.log('Default tenant already exists');
  } else {
    tenant = tenantRepository.create({
      subdomain: 'default',
      name: 'Default Organization',
      subscriptionPlan: 'professional' as any,
      status: 'active' as any,
      settings: { timezone: 'UTC', dateFormat: 'YYYY-MM-DD' },
    });
    tenant = await tenantRepository.save(tenant);
    console.log('Default tenant created');
  }

  // Create system roles
  const systemRoles = [
    {
      name: 'tenant_admin',
      displayName: 'Tenant Administrator',
      description: 'Full access to all tenant features',
      permissions: ['*'],
      priority: 10,
      isSystem: true,
    },
    {
      name: 'manager',
      displayName: 'Manager',
      description: 'Can manage projects and teams',
      permissions: ['projects.*', 'teams.*', 'tasks.*', 'reports.view'],
      priority: 20,
      isSystem: true,
    },
    {
      name: 'employee',
      displayName: 'Employee',
      description: 'Basic employee access',
      permissions: ['tasks.read', 'tasks.create', 'projects.read', 'teams.read'],
      priority: 30,
      isSystem: true,
    },
  ];

  const createdRoles: Role[] = [];
  for (const roleData of systemRoles) {
    let role = await roleRepository.findOne({ where: { name: roleData.name, tenantId: tenant.id } });
    if (!role) {
      role = roleRepository.create({ ...roleData, tenantId: tenant.id });
      role = await roleRepository.save(role);
      console.log(`Role '${roleData.name}' created`);
    } else {
      console.log(`Role '${roleData.name}' already exists`);
    }
    createdRoles.push(role);
  }

  // Create admin user
  const existingAdmin = await userRepository.findOne({ where: { email: 'admin@default.com', tenantId: tenant.id } });
  if (!existingAdmin) {
    const adminRole = createdRoles.find(r => r.name === 'tenant_admin');
    if (!adminRole) {
      console.error('Admin role not found');
      return;
    }
    const hashedPassword = await bcrypt.hash('Admin123!', 12);

    const adminUser = userRepository.create({
      email: 'admin@default.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      status: UserStatus.ACTIVE,
      roleId: adminRole.id,
      tenantId: tenant.id,
      emailVerifiedAt: new Date(),
    });
    await userRepository.save(adminUser);
    console.log('Admin user created: admin@default.com / Admin123!');
  } else {
    console.log('Admin user already exists');
  }

  // Create demo employee
  const existingEmployee = await userRepository.findOne({ where: { email: 'employee@default.com', tenantId: tenant.id } });
  if (!existingEmployee) {
    const employeeRole = createdRoles.find(r => r.name === 'employee');
    if (!employeeRole) {
      console.error('Employee role not found');
      return;
    }
    const hashedPassword = await bcrypt.hash('Employee123!', 12);

    const employeeUser = userRepository.create({
      email: 'employee@default.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      status: UserStatus.ACTIVE,
      roleId: employeeRole.id,
      tenantId: tenant.id,
      jobTitle: 'Software Developer',
      emailVerifiedAt: new Date(),
    });
    await userRepository.save(employeeUser);
    console.log('Employee user created: employee@default.com / Employee123!');
  }

  console.log('Seeding completed successfully!');
  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});