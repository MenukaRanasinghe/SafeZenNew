import { pool } from './db';

const testDbConnection = async () => {
  try {
    const [rows] = await pool.execute('SELECT 1 + 1 AS result');
    console.log('Database connection successful:', rows);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

testDbConnection();
