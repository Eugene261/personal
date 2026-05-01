import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const session = request.cookies.get('admin_session');

    // Protect /admin/dashboard and its sub-routes
    if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
        if (session?.value !== 'authenticated') {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }

    // Redirect /admin to dashboard if already authenticated
    if (request.nextUrl.pathname === '/admin') {
        if (session?.value === 'authenticated') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin', '/admin/dashboard/:path*'],
};
