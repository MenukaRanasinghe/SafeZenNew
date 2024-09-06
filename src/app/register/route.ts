import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { email, password, role } = await req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.execute('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role]);

  return NextResponse.json({ message: 'User created successfully' });
}
