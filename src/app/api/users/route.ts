import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; 

export async function GET() {
  let userCount = 0;

  try {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM users');
    userCount = rows[0].count;
  } catch (error) {
    console.error('Failed to fetch user count from the database', error);
    return NextResponse.json({ error: 'Failed to fetch user count' }, { status: 500 });
  }

  return NextResponse.json({ userCount });
}
