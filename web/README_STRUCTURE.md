# Web Application Directory Structure

This document describes the organization of the `/web` frontend application following Next.js best practices.

## Directory Structure

```
/web/src/
├── app/                    # Next.js App Router pages and layouts
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home/dashboard page
│   ├── login/             # Login page
│   └── signup/            # Signup page
├── components/            # Reusable UI components
│   └── dashboard/         # Dashboard-specific components
│       ├── DashboardApp.tsx
│       ├── header.tsx
│       ├── sidebar.tsx
│       ├── stats-card.tsx
│       ├── schedule-widget.tsx
│       ├── attendance-widget.tsx
│       ├── agenda-widget.tsx
│       └── create-exercise.tsx
├── lib/                   # Library code and API utilities
│   ├── auth.ts           # Authentication utilities
│   └── inputs.ts         # Input/file upload utilities
├── mocks/                 # Mock data for development
│   └── dashboard-data.ts # Dashboard mock data and constants
├── types/                 # TypeScript type definitions
│   └── dashboard.ts      # Dashboard-related type definitions
├── utils/                 # Helper functions and utilities (empty, for future use)
└── proxy.ts              # Next.js middleware for authentication

```

## Design Principles

### 1. Separation of Concerns
- **Pages** (`/app`): Only for routing and page-level components
- **Components** (`/components`): Reusable UI components organized by feature
- **Types** (`/types`): TypeScript interfaces and type definitions
- **Mocks** (`/mocks`): Mock data and constants for development
- **Utilities** (`/utils`): Pure functions and helper utilities
- **Lib** (`/lib`): Third-party integrations and API utilities

### 2. Import Path Aliases
The project uses TypeScript path aliases for cleaner imports:
- `@/components/*` → `/src/components/*`
- `@/types/*` → `/src/types/*`
- `@/mocks/*` → `/src/mocks/*`
- `@/lib/*` → `/src/lib/*`
- `@/utils/*` → `/src/utils/*`

Example:
```typescript
// Instead of: import { DashboardApp } from '../../../components/dashboard/DashboardApp'
import { DashboardApp } from '@/components/dashboard/DashboardApp'
```

### 3. Component Organization
Dashboard components are grouped in `/components/dashboard/`:
- Keeps related components together
- Makes imports cleaner and more maintainable
- Follows the component/feature colocation pattern

### 4. Type Safety
All TypeScript types are centralized in `/types/`:
- Makes types easily discoverable
- Prevents duplicate type definitions
- Ensures consistency across the application

### 5. Mock Data Management
Development mock data is isolated in `/mocks/`:
- Clear separation from production code
- Easy to replace with real API calls in the future
- Makes it obvious what data is temporary

## Future Improvements

As the application grows, consider:
1. Moving authentication logic to a separate `auth/` feature directory
2. Creating sub-directories in `/components` for different features
3. Adding a `/hooks` directory for custom React hooks
4. Adding a `/contexts` directory for React Context providers
5. Creating a `/config` directory for application configuration
6. Adding utility functions to `/utils` as needed

## Migration Notes

This structure was implemented on December 26, 2025, as part of the web directory restructuring task. All existing logic and mock data remain unchanged - only the file organization and import paths were updated.
