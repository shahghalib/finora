import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // ✅ Read the dedicated cookie we will set in authStore
  const token = request.cookies.get('auth-token')?.value;

  const isAuthPage =
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup');
  const isOnboardingPage = request.nextUrl.pathname.startsWith('/onboarding');
  // The landing page itself — publicly visible whether or not
  // there's a session, so it should never force-redirect to /login.
  const isLandingPage = request.nextUrl.pathname === '/';

  const isPublicPage = isAuthPage || isOnboardingPage || isLandingPage;

  // If there's no token and trying to access a protected route → redirect to login
  if (!token && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If token exists and trying to access /login or /signup → redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};