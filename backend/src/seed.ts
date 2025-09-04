import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create municipalities
  const beograd = await prisma.municipality.upsert({
    where: { name: 'Beograd' },
    update: {},
    create: {
      name: 'Beograd',
      email: 'komunalne@beograd.rs',
    },
  });

  const noviSad = await prisma.municipality.upsert({
    where: { name: 'Novi Sad' },
    update: {},
    create: {
      name: 'Novi Sad',
      email: 'komunalne@novisad.rs',
    },
  });

  console.log('Created municipalities:', { beograd, noviSad });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });