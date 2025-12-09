import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware function - MUST export
export function middleware(request: NextRequest) {
  // Token check pannu from cookies or header
  const token = request.cookies.get('token')?.value;
  
  // Current path
  const path = request.nextUrl.pathname;

  // Protected routes list
  const isProtectedRoute = 
    path.startsWith('/dashboard') || 
    path.startsWith('/items') ||
    path.startsWith('/profile');

  // Public routes - login, register, etc.
  const isPublicRoute = 
    path === '/login' || 
    path === '/register' ||
    path === '/';

  // Protected route-la token illa-na login-ku redirect
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Login page-la token irundha dashboard-ku redirect
  if (isPublicRoute && token && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Config - Which routes-ku middleware run aaganumnu
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};