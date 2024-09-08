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
            return NextResponse.json({ error: 'All fields (name, description, deadline, status) are required' }, { status: 400 });
        }

        console.log('Received task data:', { name, description, deadline, status });

        const [result] = await pool.query(
            'INSERT INTO tasks (name, description, deadline, status) VALUES (?, ?, ?, ?)',
            [name, description, deadline, status]
        );
        console.log('Task insertion result:', result);

        const newTask = { id: result.insertId, name, description, deadline, status };

        return NextResponse.json({ task: newTask, message: 'Task created successfully' });
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json({ error: 'Failed to create task', details: error.message }, { status: 500 });
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

    console.log('PATCH Request - Task ID:', id, { name, description, deadline, status });

    if (!id) {
      console.log('Task ID is missing');
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    if (!name && !description && !deadline && !status) {
      console.log('No fields to update');
      return NextResponse.json({ error: 'At least one field to update is required' }, { status: 400 });
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
    console.log('Executing SQL Query:', updateQuery);
    console.log('With Values:', values);

    const [result] = await pool.query(updateQuery, values);
    console.log('Query Result:', result);

    if (result.affectedRows === 0) {
      console.log('No task found with the given ID');
      return NextResponse.json({ error: 'No task found with the given ID' }, { status: 404 });
    }

    const [taskRows] = await pool.query('SELECT id, name, description, deadline, status FROM tasks WHERE id = ?', [id]);
    const updatedTask = taskRows[0];
    console.log('Updated Task:', updatedTask);

    return NextResponse.json({ task: updatedTask, message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}



