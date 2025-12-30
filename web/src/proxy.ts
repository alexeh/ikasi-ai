import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Configure which routes the middleware should run on
// Paths excluded from authentication:
// - api/auth (NextAuth API routes)
// - _next/static (static files)
// - _next/image (image optimization files)
// - favicon.ico (favicon file)
// - login and signup pages
// - public file extensions (svg, png, jpg, jpeg, gif, webp)
export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|login|signup|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
