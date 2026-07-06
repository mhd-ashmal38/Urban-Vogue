import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@urbanvogue.com' },
    update: {},
    create: {
      email: 'admin@urbanvogue.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('Admin user created/updated:', admin.email);

  // Create test user
  const testUserPassword = await bcrypt.hash('Test123!', 10);

  const testUser = await prisma.user.upsert({
    where: { email: 'test@urbanvogue.com' },
    update: {},
    create: {
      email: 'test@urbanvogue.com',
      password: testUserPassword,
      name: 'Test User',
      role: 'USER',
      isActive: true,
    },
  });

  console.log('Test user created/updated:', testUser.email);

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
