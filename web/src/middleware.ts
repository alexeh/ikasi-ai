export { default } from "next-auth/middleware";

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - login and signup pages
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|login|signup|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
