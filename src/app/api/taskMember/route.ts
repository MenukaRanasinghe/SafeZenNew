import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const [taskRows] = await pool.query(`
      SELECT t.id, t.name, t.description, t.deadline, t.status, ta.submission 
      FROM tasks t
      JOIN task_assignments ta ON t.id = ta.task_id
      WHERE ta.user_id = ?`, [userId]);

    const tasks = taskRows;

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching member tasks:', error);
    return NextResponse.json({ tasks: [] }, { status: 500 });
  }
}
