import { Client } from 'pg';

const client = new Client({ connectionString: "postgresql://skillgap:skillgap123@localhost:5432/skillgap_db" });

async function test() {
  try {
    await client.connect();
    const res = await client.query('SELECT current_user, current_database();');
    console.log('Connection successful:', res.rows[0]);
    
    const count = await client.query('SELECT count(*) FROM "User";');
    console.log('User table count:', count.rows[0]);
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    await client.end();
  }
}

test();
