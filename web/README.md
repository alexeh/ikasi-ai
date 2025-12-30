yarn dev
## Overview

This package hosts the Next.js client for the Ikasi teacher dashboard. The previously standalone Vite demo that lived under `web/to-integrate` has been migrated into the main application and is rendered from `app/DashboardApp.tsx`.

Visiting [http://localhost:3001](http://localhost:3001) now loads the full teacher experience (sidebar, header tools, agenda, attendance, calendar, meetings, etc.). All React components, mock data and helpers were lifted from `to-integrate` and converted to idiomatic Next.js client components that live under `src/app`.

## Getting Started

### Prerequisites

1. Node.js 24.12.0 (as specified in package.json)
2. pnpm 10.13.1

### Installation

```bash
pnpm install
```

### Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env.local
```

Update the following variables in `.env.local`:

```bash
# Generate a secret with: openssl rand -base64 32
NEXTAUTH_SECRET=your-secret-key-here

# Application URL (default for development)
NEXTAUTH_URL=http://localhost:3001

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Running the Application

```bash
pnpm dev --filter @ikasi-ai/web
```

Then open [http://localhost:3001](http://localhost:3001) in your browser.

## Authentication

The application uses [NextAuth.js](https://next-auth.js.org/) for authentication. Key features:

- **JWT-based sessions**: Secure, HTTP-only cookie sessions
- **Credentials provider**: Email/password authentication with backend API
- **Role-based access**: Support for teacher, student, and admin roles
- **Session management**: 7-day session expiration with automatic refresh
- **Type-safe**: Full TypeScript support with custom type definitions

For detailed documentation, see [NEXTAUTH_GUIDE.md](./NEXTAUTH_GUIDE.md).

### Quick Authentication Usage

**Client Components:**
```tsx
import { useSession, signOut } from 'next-auth/react';

function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') return <div>Please sign in</div>;
  
  return (
    <div>
      <p>Welcome, {session.user.name}!</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
```

**Server Components:**
```tsx
import { getCurrentUser } from '@/lib/session';

async function MyServerComponent() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return <div>Welcome, {user.name}!</div>;
}
```

## Development Notes

- The primary entry point is `src/app/DashboardApp.tsx`, which stitches together the migrated dashboard widgets.
- Shared data models and mocks can be found in `src/app/dashboard-*.ts` files.
- UI primitives rely on `lucide-react` for icons and `recharts` for charts.
- Tailwind CSS v4 (via the `@tailwindcss/postcss` preset) powers the utility classes.

Feel free to add new routes or components following the existing patterns. The legacy Vite scaffold remains under `web/to-integrate` for reference; remove it once it’s no longer needed.
