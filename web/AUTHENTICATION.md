# Authentication Guidelines

This document outlines the authentication strategy implemented in the Ikasi AI web application.

## Overview

The application uses a token-based authentication system with Next.js 16's proxy (middleware) feature to protect routes and manage user sessions.

## Architecture

### Token Storage

Access tokens are stored in two locations for maximum compatibility:
1. **localStorage** - For client-side JavaScript access
2. **HTTP Cookies** - For server-side middleware access

This dual-storage approach ensures that:
- Client-side components can access the token via `getToken()`
- Server-side middleware can validate authentication before rendering pages

### Protected Routes

The following routes require authentication:
- `/` (Dashboard/Home page)

### Public Routes

The following routes are accessible without authentication:
- `/login` - User login page
- `/signup` - User registration page

**Note:** If an authenticated user tries to access `/login` or `/signup`, they will be automatically redirected to the dashboard (`/`).

## Implementation Details

### Proxy (Middleware)

Location: `web/src/proxy.ts`

The proxy function runs on every request and:
1. Checks for the `access_token` cookie
2. Redirects unauthenticated users from protected routes to `/login`
3. Redirects authenticated users from auth routes to `/`

### Authentication Functions

Location: `web/src/lib/auth.ts`

#### Core Functions

- **`login(data: LoginData): Promise<AuthResponse>`** - Authenticates user with email and password
- **`signup(data: SignupData): Promise<AuthResponse>`** - Registers a new user
- **`saveToken(token: string): void`** - Saves the access token to both localStorage and cookies
- **`getToken(): string | null`** - Retrieves the access token (checks localStorage first, then cookies)
- **`removeToken(): void`** - Removes the access token from both localStorage and cookies
- **`isAuthenticated(): boolean`** - Returns true if a valid token exists

#### Token Lifecycle

1. **Login/Signup**: After successful authentication, call `saveToken(token)` to store the access token
2. **Token Persistence**: Tokens are stored with a 7-day expiration in cookies
3. **Logout**: Call `removeToken()` to clear the token and trigger redirect to login

### Cookie Configuration

Cookies are configured with the following settings:
- **Path**: `/` (available site-wide)
- **Max-Age**: 604800 seconds (7 days)
- **SameSite**: `Lax` (provides CSRF protection while allowing normal navigation)

## Usage Examples

### Logging In

```typescript
import { login, saveToken } from '@/lib/auth';

const handleLogin = async (email: string, password: string) => {
  try {
    const { access_token } = await login({ email, password });
    saveToken(access_token);
    router.push('/'); // Redirect to dashboard
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Logging Out

```typescript
import { removeToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const handleLogout = () => {
  removeToken();
  router.push('/login');
};
```

### Checking Authentication Status

```typescript
import { isAuthenticated } from '@/lib/auth';

if (isAuthenticated()) {
  // User is logged in
} else {
  // User is not logged in
}
```

## Security Considerations

1. **HTTPS**: In production, ensure the application is served over HTTPS to protect tokens in transit
2. **Token Validation**: The API should validate tokens on every protected request
3. **Token Expiration**: Implement token refresh logic for long-lived sessions
4. **XSS Protection**: Never expose sensitive data in client-side code
5. **CSRF Protection**: The `SameSite=Lax` cookie attribute provides basic CSRF protection

## Future Enhancements

Consider implementing the following features:

1. **Token Refresh**: Implement automatic token refresh before expiration
2. **Remember Me**: Add option for longer session duration
3. **Multi-factor Authentication**: Add 2FA support for enhanced security
4. **Session Management**: Track and manage multiple user sessions
5. **OAuth Integration**: Add social login options (Google, GitHub, etc.)

## API Integration

The authentication functions integrate with the backend API:

- **Login Endpoint**: `POST /auth/login`
- **Signup Endpoint**: `POST /auth/signup`

The API URL is configured via the `NEXT_PUBLIC_API_URL` environment variable (defaults to `http://localhost:3000`).

## Testing Authentication

To test the authentication flow:

1. Start the development server: `pnpm run dev`
2. Navigate to `http://localhost:3000` - should redirect to `/login`
3. Try to access `/login` or `/signup` with a valid token - should redirect to `/`
4. Log in successfully - should redirect to dashboard with access to protected routes
5. Clear cookies/localStorage - should be redirected back to `/login`
