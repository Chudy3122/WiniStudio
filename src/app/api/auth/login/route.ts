import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials, signToken, getSessionCookieOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const valid = await verifyAdminCredentials(username, password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const token = await signToken({ username });
    const options = getSessionCookieOptions();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(options.name, token, options);
    return res;
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
