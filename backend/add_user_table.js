const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL.replace('?pgbouncer=true', '').replace(':6543/', ':5432/'),
});

async function run() {
  await client.connect();
  console.log('Connected to DB');

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      );
      CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
    `);
    console.log('✓ User table created');

    // Create a default admin user if not exists
    // Password is "admin123" (hashed)
    const adminEmail = 'admin@candely.com';
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const checkAdmin = await client.query('SELECT * FROM "User" WHERE email = $1', [adminEmail]);
    if (checkAdmin.rows.length === 0) {
      await client.query(
        'INSERT INTO "User" (id, email, password, name) VALUES ($1, $2, $3, $4)',
        [require('crypto').randomUUID(), adminEmail, hashedPassword, 'Candely Admin']
      );
      console.log('✓ Default admin user created: admin@candely.com / admin123');
    }

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
