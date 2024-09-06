import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
    try {
      const [countRows] = await pool.query('SELECT COUNT(*) as count FROM tasks');
      const taskCount = countRows[0]?.count || 0;
  
      const [taskRows] = await pool.query('SELECT id, name, description, deadline, status FROM tasks');
      const tasks = taskRows;
  
      return NextResponse.json({ taskCount, tasks });
    } catch (error) {
      console.error('Error fetching task data:', error);
      return NextResponse.json({ taskCount: 0, tasks: [] });
    }
  }

export async function POST(request: Request) {
  try {
    const { name, description, deadline, status } = await request.json();

    if (!name || !description || !deadline || !status) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await pool.query('INSERT INTO tasks (name, description, deadline, status) VALUES (?, ?, ?, ?)', [name, description, deadline, status]);
    return NextResponse.json({ message: 'Task created successfully' });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });

    await pool.query('DELETE FROM tasks WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { name, description, deadline, status } = await request.json();

    if (!id || (!name && !description && !deadline && !status)) {
      return NextResponse.json({ error: 'Task ID and at least one field to update are required' }, { status: 400 });
    }

    const updates = [];
    const values = [];
    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (description) {
      updates.push('description = ?');
      values.push(description);
    }
    if (deadline) {
      updates.push('deadline = ?');
      values.push(deadline);
    }
    if (status) {
      updates.push('status = ?');
      values.push(status);
    }
    values.push(id);

    const updateQuery = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
    await pool.query(updateQuery, values);

    return NextResponse.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}