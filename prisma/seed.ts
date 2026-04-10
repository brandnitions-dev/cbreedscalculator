import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed admin user
  const passwordHash = await bcrypt.hash('CrownBreeds2024!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@crownbreeds.com' },
    update: {},
    create: {
      email: 'admin@crownbreeds.com',
      name: 'Crown Breeds Admin',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  console.log('');
  console.log('🎉 Seed complete!');
  console.log('');
  console.log('   Admin login:');
  console.log('   Email:    admin@crownbreeds.com');
  console.log('   Password: CrownBreeds2024!');
  console.log('');
  console.log('   ⚠️  Change this password immediately after first login.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
