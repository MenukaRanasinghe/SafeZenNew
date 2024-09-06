import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { taskId, submission } = await request.json();

    if (!taskId || !submission) {
      return NextResponse.json({ error: 'Task ID and submission are required' }, { status: 400 });
    }

    await pool.query('UPDATE task_assignments SET submission = ? WHERE task_id = ?', [submission, taskId]);

    return NextResponse.json({ message: 'Task submitted successfully' });
  } catch (error) {
    console.error('Error submitting task:', error);
    return NextResponse.json({ error: 'Error submitting task' }, { status: 500 });
  }
}
