import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const [countRows] = await pool.query('SELECT COUNT(*) as count FROM users');
    const userCount = countRows[0]?.count || 0;

    const [userRows] = await pool.query('SELECT id, email, role FROM users');
    const users = userRows;

    return NextResponse.json({ userCount, users });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ userCount: 0, users: [] });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });

    await pool.query('DELETE FROM users WHERE id = ?', [id]);

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { role } = await request.json();

    if (!id || !role) return NextResponse.json({ error: 'User ID and role are required' }, { status: 400 });

    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);

    return NextResponse.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
  }
}
