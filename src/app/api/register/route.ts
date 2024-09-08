import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json();
    
    if (!email || !password || !role) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await pool.execute('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role]);
    
    return NextResponse.json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error inserting user:', error);
    return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
  }
}
