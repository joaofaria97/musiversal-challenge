import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const salt = process.env.PASSWORD_SALT;
    const hashedPasswordEnv = process.env.SHARED_PASSWORD_HASH;

    if (!salt || !hashedPasswordEnv) {
      console.error('Authentication environment variables not set on the server.');
      return NextResponse.json({ error: 'Authentication configuration error.' }, { status: 500 });
    }

    const hashedPasswordAttempt = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');

    if (hashedPasswordAttempt === hashedPasswordEnv) {
      return NextResponse.json({ success: true, message: 'Login successful' });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
} 