import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? 'fallback-secret-change-this');

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminProtected =
    pathname.startsWith('/wini-admin/') && pathname !== '/wini-admin/';

  if (isAdminProtected) {
    const token = req.cookies.get('wini_session')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/wini-admin', req.url));
    }
    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      const res = NextResponse.redirect(new URL('/wini-admin', req.url));
      res.cookies.delete('wini_session');
      return res;
    }
  }

  if (pathname === '/wini-admin') {
    const token = req.cookies.get('wini_session')?.value;
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL('/wini-admin/dashboard', req.url));
      } catch {
        // Invalid token, let them through to login
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/wini-admin', '/wini-admin/:path*'],
};
