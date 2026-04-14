const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.meeting.deleteMany();
  await prisma.eventType.deleteMany();
  await prisma.availability.deleteMany();

  // Seed Event Types
  const event1 = await prisma.eventType.create({
    data: {
      name: '15 Minute Meeting',
      slug: '15min',
      duration: 15,
      description: 'Quick check-in or brief consultation.',
      color: '#006bff',
    },
  });

  const event2 = await prisma.eventType.create({
    data: {
      name: '30 Minute Meeting',
      slug: '30min',
      duration: 30,
      description: 'Standard meeting for project discussions or discovery calls.',
      color: '#1a1a1a',
    },
  });

  const event3 = await prisma.eventType.create({
    data: {
      name: '60 Minute Meeting',
      slug: '60min',
      duration: 60,
      description: 'Deep dive session or strategy planning.',
      color: '#ff4f00',
    },
  });

  // Seed Availability (Mon-Fri, 9 AM - 5 PM)
  const defaultAvailability = [];
  for (let i = 1; i <= 5; i++) {
    defaultAvailability.push({
      dayOfWeek: i,
      startTime: '09:00',
      endTime: '17:00',
      timezone: 'UTC',
    });
  }
  await prisma.availability.createMany({
    data: defaultAvailability,
  });

  // Seed sample meetings
  await prisma.meeting.create({
    data: {
      inviteeName: 'John Doe',
      inviteeEmail: 'john@example.com',
      startTime: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(10, 0, 0, 0)),
      endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(10, 30, 0, 0)),
      eventTypeId: event2.id,
      status: 'confirmed',
    },
  });

  await prisma.meeting.create({
    data: {
      inviteeName: 'Jane Smith',
      inviteeEmail: 'jane@example.com',
      startTime: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(14, 0, 0, 0)),
      endTime: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(15, 0, 0, 0)),
      eventTypeId: event3.id,
      status: 'confirmed',
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
