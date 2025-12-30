# NextAuth Authentication Guide

This document provides comprehensive guidance on the NextAuth authentication implementation in the Ikasi AI web application.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Configuration](#configuration)
4. [Usage Examples](#usage-examples)
5. [API Reference](#api-reference)
6. [Security Best Practices](#security-best-practices)
7. [Troubleshooting](#troubleshooting)
8. [Extending the System](#extending-the-system)

## Overview

The application uses [NextAuth.js](https://next-auth.js.org/) v4, a complete authentication solution for Next.js applications. It provides:

- 🔐 Secure JWT-based session management
- 🔑 Credentials provider for email/password authentication
- 🌐 Server and client-side authentication utilities
- 🛡️ Built-in CSRF protection
- 📦 Seamless integration with Next.js 13+ App Router

### Key Features

- **Token-based authentication**: Uses JWT tokens from the backend API
- **Session persistence**: Sessions are stored as secure HTTP-only cookies
- **Role-based access**: Supports teacher, student, and admin roles
- **Automatic redirects**: Middleware protects routes and handles redirects
- **Type-safe**: Full TypeScript support with custom type definitions

## Architecture

### Component Structure

```
web/src/
├── app/
│   ├── api/auth/
│   │   ├── [...nextauth]/route.ts   # NextAuth API handler
│   │   └── signup/route.ts          # Custom signup endpoint
│   ├── login/page.tsx               # Login page
│   ├── signup/page.tsx              # Signup page
│   └── layout.tsx                   # Root layout with SessionProvider
├── components/
│   └── providers.tsx                # SessionProvider wrapper
├── lib/
│   ├── auth-config.ts               # NextAuth configuration
│   ├── auth.ts                      # Legacy auth utilities (deprecated)
│   └── session.ts                   # Server-side session utilities
├── types/
│   └── next-auth.d.ts               # TypeScript type definitions
└── proxy.ts                     # Route protection middleware
```

### Authentication Flow

#### Login Flow

1. User submits credentials on `/login`
2. `signIn()` calls the NextAuth credentials provider
3. Provider authenticates with backend API at `/auth/login`
4. Backend returns JWT access token
5. NextAuth decodes token and creates session
6. Session stored as secure HTTP-only cookie
7. User redirected to dashboard

#### Signup Flow

1. User submits registration form on `/signup`
2. Frontend calls `/api/auth/signup`
3. API route forwards request to backend `/auth/signup`
4. Backend creates user and returns JWT token
5. Frontend automatically signs in the user via `signIn()`
6. Session created and user redirected to dashboard

### Session Management

- **Storage**: HTTP-only cookies (secure, not accessible via JavaScript)
- **Duration**: 7 days (configurable)
- **Strategy**: JWT (stateless)
- **Token**: Contains user ID, email, name, role, locale, and access token

## Configuration

### Environment Variables

Create a `.env.local` file in the `web` directory:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here-replace-in-production
NEXTAUTH_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### Environment Variable Descriptions

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXTAUTH_SECRET` | Secret key for encrypting tokens and cookies | Yes | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Canonical URL of your site | Yes (production) | `https://yourdomain.com` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes | `http://localhost:3000` |

### NextAuth Options

The configuration is located in `web/src/lib/auth-config.ts`:

```typescript
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // Credentials configuration
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    // JWT and session callbacks
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

## Usage Examples

### Client Components

#### Using the Session

```tsx
'use client';

import { useSession, signOut } from 'next-auth/react';

export function UserProfile() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      <p>Welcome, {session?.user?.name}!</p>
      <p>Email: {session?.user?.email}</p>
      <p>Role: {session?.user?.role}</p>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}
```

#### Conditional Rendering Based on Authentication

```tsx
'use client';

import { useSession } from 'next-auth/react';

export function ProtectedContent() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      // Redirect to login page
      window.location.href = '/login';
    },
  });

  return <div>Protected content</div>;
}
```

#### Role-Based Access

```tsx
'use client';

import { useSession } from 'next-auth/react';

export function TeacherDashboard() {
  const { data: session } = useSession();

  if (session?.user?.role !== 'teacher') {
    return <div>Access denied</div>;
  }

  return <div>Teacher Dashboard</div>;
}
```

### Server Components

#### Getting the Current User

```tsx
import { getCurrentUser } from '@/lib/session';

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
```

#### Checking Authentication Status

```tsx
import { isAuthenticated } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect('/login');
  }

  return <div>Protected Content</div>;
}
```

### API Routes

#### Accessing Session in API Routes

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Access user data
  const userId = session.user.id;
  const userRole = session.user.role;

  return NextResponse.json({ data: 'Protected data' });
}
```

#### Making Authenticated Requests to Backend API

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export async function GET() {
  const session = await getServerSession(authOptions);
  const accessToken = session?.user?.accessToken;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/data`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  return response;
}
```

### Authentication Actions

#### Login

```tsx
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.error('Login failed:', result.error);
    } else {
      // Redirect to dashboard
      window.location.href = '/';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

#### Logout

```tsx
'use client';

import { signOut } from 'next-auth/react';

export function LogoutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/login' })}>
      Logout
    </button>
  );
}
```

## API Reference

### Client-Side Hooks

#### `useSession()`

Returns the current session and loading status.

```typescript
const { data: session, status } = useSession();
```

**Return values:**
- `session`: Session object or null
- `status`: 'loading' | 'authenticated' | 'unauthenticated'

#### `signIn(provider, options)`

Sign in with the specified provider.

```typescript
await signIn('credentials', {
  email: 'user@example.com',
  password: 'password',
  redirect: false,
});
```

**Parameters:**
- `provider`: Provider ID (use 'credentials' for email/password)
- `options`: Configuration options
  - `redirect`: Whether to redirect after sign in (default: true)
  - `callbackUrl`: URL to redirect to after sign in
  - Additional provider-specific options

#### `signOut(options)`

Sign out the current user.

```typescript
await signOut({ callbackUrl: '/login' });
```

**Parameters:**
- `options.callbackUrl`: URL to redirect to after sign out

### Server-Side Functions

#### `getSession()`

Get the current session on the server side.

```typescript
import { getSession } from '@/lib/session';

const session = await getSession();
```

#### `getCurrentUser()`

Get the current user from the session.

```typescript
import { getCurrentUser } from '@/lib/session';

const user = await getCurrentUser();
```

#### `isAuthenticated()`

Check if the user is authenticated.

```typescript
import { isAuthenticated } from '@/lib/session';

const authenticated = await isAuthenticated();
```

### Session Object

```typescript
{
  user: {
    id: string;
    email: string;
    name: string;
    lname?: string;
    role: 'teacher' | 'student' | 'admin';
    locale: string;
    accessToken: string;
  };
  expires: string;
}
```

## Security Best Practices

### 1. Environment Variables

- **Never commit** `.env.local` or `.env` files to version control
- Use strong, randomly generated secrets for `NEXTAUTH_SECRET`
- Rotate secrets regularly in production
- Use different secrets for different environments

### 2. Token Security

- Backend JWT tokens are stored in HTTP-only cookies
- Tokens are not accessible via JavaScript (XSS protection)
- Always use HTTPS in production
- Token expiration is set to 7 days by default

### 3. CSRF Protection

- NextAuth provides built-in CSRF protection
- CSRF tokens are automatically validated on state-changing operations
- No additional configuration required

### 4. Password Security

- Passwords are never stored in the frontend
- Backend handles password hashing (bcrypt)
- Minimum password length enforced (6 characters)
- Consider implementing password strength requirements

### 5. API Security

- Always validate sessions in API routes
- Use the `accessToken` from the session for backend API calls
- Implement rate limiting for authentication endpoints
- Log authentication failures for monitoring

### 6. Session Management

- Sessions expire after 7 days of inactivity
- Implement token refresh for long-lived sessions
- Clear sessions on password change
- Allow users to view and revoke active sessions

### 7. Secure Headers

Configure Next.js security headers in `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

## Troubleshooting

### Common Issues

#### 1. "Invalid credentials" error

**Symptoms**: Login fails with "Invalid credentials" message

**Solutions**:
- Verify email and password are correct
- Check that backend API is running and accessible
- Verify `NEXT_PUBLIC_API_URL` environment variable is set correctly
- Check backend API logs for authentication errors

#### 2. Session not persisting

**Symptoms**: User gets logged out on page refresh

**Solutions**:
- Ensure `NEXTAUTH_SECRET` is set in environment variables
- Check that cookies are enabled in the browser
- Verify `NEXTAUTH_URL` matches your application URL
- Check for conflicting middleware or cookie configurations

#### 3. Middleware not protecting routes

**Symptoms**: Users can access protected routes without authentication

**Solutions**:
- Verify proxy.ts is in the correct location (`web/src/proxy.ts`)
- Check the `matcher` configuration includes the routes to protect
- Ensure NextAuth session cookie is being set correctly
- Test with different browsers to rule out browser-specific issues

#### 4. TypeScript errors

**Symptoms**: TypeScript complains about session types

**Solutions**:
- Ensure `web/src/types/next-auth.d.ts` is included in tsconfig.json
- Restart TypeScript server in your editor
- Check that type definitions match your session structure

#### 5. Redirect loop

**Symptoms**: Browser gets stuck in a redirect loop

**Solutions**:
- Check middleware matcher configuration
- Ensure login/signup pages are excluded from authentication
- Verify callback URLs in NextAuth configuration
- Clear browser cookies and cache

### Debug Mode

Enable NextAuth debug mode for development:

```typescript
// In auth-config.ts
export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  // ... other options
};
```

This will log detailed authentication information to the console.

## Extending the System

### Adding OAuth Providers

To add social login (Google, GitHub, etc.):

1. Install the provider package (if needed)
2. Add provider configuration to `auth-config.ts`:

```typescript
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // ... existing providers
  ],
  // ... other options
};
```

3. Update environment variables:

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. Update the backend to handle OAuth users

### Implementing Token Refresh

To implement automatic token refresh:

1. Store refresh token in session:

```typescript
// In auth-config.ts
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.accessToken = user.accessToken;
      token.refreshToken = user.refreshToken; // Add refresh token
      token.accessTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    }

    // Check if token needs refresh
    if (Date.now() < token.accessTokenExpires) {
      return token;
    }

    // Refresh the token
    return refreshAccessToken(token);
  },
}
```

2. Implement refresh function:

```typescript
async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + 60 * 60 * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
```

### Custom Session Data

To add custom data to the session:

1. Update type definitions in `next-auth.d.ts`
2. Modify JWT callback to include the data
3. Update session callback to pass data to client

Example:

```typescript
// In auth-config.ts
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.customField = user.customField;
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.customField = token.customField;
    }
    return session;
  },
}
```

### Role-Based Middleware

To implement granular role-based access control:

```typescript
// In proxy.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Teacher-only routes
    if (path.startsWith('/teacher') && token?.role !== 'teacher') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Admin-only routes
    if (path.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|login|signup).*)'],
};
```

### Multi-Factor Authentication (MFA)

To add MFA support:

1. Create an MFA verification page
2. Store MFA status in user session
3. Update authorization callback to check MFA:

```typescript
callbacks: {
  async jwt({ token, user, trigger }) {
    if (user) {
      token.mfaVerified = false;
      token.mfaRequired = user.mfaEnabled;
    }

    if (trigger === "update") {
      // Update MFA status after verification
      token.mfaVerified = true;
    }

    return token;
  },
  async signIn({ user }) {
    // If MFA is enabled, redirect to MFA page
    if (user.mfaEnabled) {
      return '/mfa-verify';
    }
    return true;
  },
}
```

### Email Verification

To require email verification:

1. Add email verification status to user model
2. Update authorization callback:

```typescript
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.emailVerified = user.emailVerified;
    }
    return token;
  },
  async signIn({ user }) {
    if (!user.emailVerified) {
      return '/verify-email';
    }
    return true;
  },
}
```

## Migration from Custom Auth

If you're migrating from the old custom auth system:

### 1. Update Components

Replace old auth imports:

```typescript
// Old
import { getToken, isAuthenticated } from '@/lib/auth';

// New
import { useSession } from 'next-auth/react';
```

### 2. Update Server Components

Replace old server-side auth:

```typescript
// Old
import { cookies } from 'next/headers';
const token = cookies().get('access_token');

// New
import { getCurrentUser } from '@/lib/session';
const user = await getCurrentUser();
```

### 3. Update Logout

Replace old logout:

```typescript
// Old
import { removeToken } from '@/lib/auth';
removeToken();

// New
import { signOut } from 'next-auth/react';
signOut();
```

### 4. Cleanup

After migration, you can remove:
- `web/src/lib/auth.ts` (deprecated functions)
- Any custom middleware logic
- Manual token management code

## Support and Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [NextAuth.js GitHub](https://github.com/nextauthjs/next-auth)
- [Next.js Documentation](https://nextjs.org/docs)

## Changelog

### Version 1.0.0 (Current)

- Initial NextAuth implementation
- Credentials provider for email/password
- JWT session strategy
- Custom type definitions
- Middleware-based route protection
- Signup integration
- Comprehensive documentation
