import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Paths that should be excluded from authentication
const PUBLIC_PATHS = [
  'api/auth',
  '_next/static',
  '_next/image',
  'favicon.ico',
  'login',
  'signup',
];

// File extensions that should be excluded
const PUBLIC_FILE_EXTENSIONS = ['svg', 'png', 'jpg', 'jpeg', 'gif', 'webp'];

// Build the matcher regex dynamically
const buildMatcherPattern = () => {
  const pathsPattern = PUBLIC_PATHS.join('|');
  const extensionsPattern = PUBLIC_FILE_EXTENSIONS.join('|');
  return `/((?!${pathsPattern}|.*\\.(?:${extensionsPattern})$).*)`;
};

export default withAuth(
  function middleware(req) {
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
export const config = {
  matcher: [buildMatcherPattern()],
};
