import { NextResponse, type NextRequest } from 'next/server';
import { runWithAmplifyServerContext } from '@/utils/amplify/server';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Run Amplify checks in server context
  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        return session.tokens !== undefined;
      } catch (error) {
        return false;
      }
    },
  });

  const { pathname } = request.nextUrl;

  // Protected routes logic
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/profile')) {
    if (!authenticated) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Auth pages logic (redirect to dashboard if already logged in)
  const authPages = ['/login', '/signup', '/role-selection'];
  if (authPages.includes(pathname) && authenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
