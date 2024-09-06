import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { taskId, userId } = await request.json();

    if (!taskId || !userId) {
      return NextResponse.json({ error: 'Task ID and User ID are required' }, { status: 400 });
    }

    await pool.query('INSERT INTO task_assignments (task_id, user_id) VALUES (?, ?)', [taskId, userId]);

    await pool.query('UPDATE tasks SET status = ? WHERE id = ?', ['In Progress', taskId]);

    return NextResponse.json({ message: 'Task assigned successfully' });
  } catch (error) {
    console.error('Error assigning task:', error);
    return NextResponse.json({ error: 'Failed to assign task' }, { status: 500 });
  }
}
