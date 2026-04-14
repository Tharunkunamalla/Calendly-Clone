const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const counts = await prisma.eventType.count();
    console.log('Database connection SUCCESS! EventType count:', counts);
  } catch (err) {
    console.error('Database connection FAILED:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
