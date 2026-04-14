const { Client } = require('pg');
require('dotenv').config();

const connectionString = "postgresql://postgres.kgpnuomiuqgjhurfosyx:akjdfklsdjfkldsfjkd@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";

async function fix() {
  const client = new Client({ connectionString });
  try {
    console.log('Connecting to Supabase...');
    await client.connect();
    console.log('Connected! Creating tables...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS "EventType" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "slug" TEXT UNIQUE NOT NULL,
        "duration" INTEGER NOT NULL,
        "description" TEXT,
        "color" TEXT DEFAULT '#006bff',
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "Availability" (
        "id" TEXT PRIMARY KEY,
        "dayOfWeek" INTEGER NOT NULL,
        "startTime" TEXT NOT NULL,
        "endTime" TEXT NOT NULL,
        "timezone" TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE ("dayOfWeek")
      );

      CREATE TABLE IF NOT EXISTS "Meeting" (
        "id" TEXT PRIMARY KEY,
        "eventTypeId" TEXT NOT NULL,
        "startTime" TIMESTAMP NOT NULL,
        "endTime" TIMESTAMP NOT NULL,
        "inviteeName" TEXT NOT NULL,
        "inviteeEmail" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'confirmed',
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("eventTypeId") REFERENCES "EventType"("id")
      );
    `);

    console.log('Tables created successfully via direct SQL!');
  } catch (err) {
    console.error('FAILED to fix DB:', err);
  } finally {
    await client.end();
  }
}

fix();
