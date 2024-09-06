import { pool } from './db';

async function testDBConnection() {
  try {
    const [rows] = await pool.execute('SELECT * FROM users');
    console.log(rows);
  } catch (error) {
    console.error('Error executing query:', error);
  }
}

testDBConnection();
