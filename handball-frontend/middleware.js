import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip auth check for login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check for auth token in cookies
    const authToken = request.cookies.get('admin_auth');
    
    if (!authToken) {
      // Redirect to login if no auth token
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      // Parse and validate the auth token
      const authData = JSON.parse(authToken.value);
      const now = Date.now();
      const tokenAge = now - authData.timestamp;
      
      // Token expires after 24 hours
      if (tokenAge > 24 * 60 * 60 * 1000) {
        // Token expired, redirect to login
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('admin_auth');
        return response;
      }
    } catch (error) {
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_auth');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};