import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get path from URL
  const path = request.nextUrl.pathname;

  // Define public paths that don't require auth
  const isPublicPath = path === '/login' || path === '/signup';
  const isProtectedPath = 
    path === '/services/provide/add' || 
    path === '/services/request/add' || 
    path === '/admin';

  // Get token from cookies
  const token = request.cookies.get('authToken')?.value;

  // Redirect authenticated users trying to access login/signup to home
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/services', request.url));
  }

  // Redirect unauthenticated users to login only for protected paths
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/services/provide/add',
    '/services/request/add',
    '/admin'
  ]
};