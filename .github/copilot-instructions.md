# Copilot Instructions for Ikasi AI

## Project Overview

Ikasi AI is a teacher dashboard application built as a monorepo with the following structure:
- **web**: Next.js 16 frontend application for the teacher dashboard
- **api**: NestJS backend API server
- **shared**: Shared TypeScript types and utilities

## Technology Stack

### Frontend (web)
- **Framework**: Next.js 16 with App Router and Turbopack
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS v4
- **Authentication**: NextAuth.js v4 with JWT sessions
- **Icons**: lucide-react
- **Charts**: recharts
- **Runtime**: Node.js 24.12.0

### Backend (api)
- **Framework**: NestJS 11
- **Language**: TypeScript 5.9.3
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **Storage**: AWS S3
- **AI Integration**: Google Generative AI (Gemini)
- **Runtime**: Node.js 24.12.0

### Shared Package
- **Purpose**: Common TypeScript types and utilities
- **Language**: TypeScript 5.9.3

## Package Management

- **Package Manager**: pnpm 10.13.1 (required)
- **Node Version**: 24.12.0 (specified in .nvmrc and package.json engines)
- **Workspace**: pnpm workspaces with packages in web/, api/, and shared/

## Development Commands

### Monorepo Commands (from root)
```bash
# Run all packages in development mode
pnpm dev

# Run specific package
pnpm dev:api    # Start NestJS API in watch mode
pnpm dev:web    # Start Next.js web app with Turbopack

# Build all packages
pnpm build

# Lint all packages
pnpm lint

# Type check all packages
pnpm typecheck
```

### Web Package Commands
```bash
# From web/ directory or use --filter @ikasi-ai/web
pnpm dev        # Start Next.js dev server (port 3001 when API runs on 3000)
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # ESLint check
```

### API Package Commands
```bash
# From api/ directory or use --filter @ikasi-ai/api
pnpm start:dev  # Start NestJS in watch mode (default port 3000)
pnpm build      # Compile TypeScript
pnpm lint       # ESLint with auto-fix
pnpm test       # Run Jest unit tests
pnpm test:e2e   # Run e2e tests
pnpm test:cov   # Run tests with coverage
```

## Code Style and Conventions

### TypeScript
- Use strict mode (enabled in tsconfig.base.json)
- Target ES2024 with NodeNext module resolution
- Enable all strict type checking options
- Use explicit types for public APIs
- Leverage TypeScript's type inference for internal variables

### ESLint Configuration

**Web (Next.js)**:
- Uses Next.js recommended configs (core-web-vitals + typescript)
- Flat config format (ESM)

**API (NestJS)**:
- Uses TypeScript ESLint recommended config
- Prettier integration for formatting
- Rules:
  - `@typescript-eslint/no-explicit-any`: off
  - `@typescript-eslint/no-unsafe-assignment`: off
  - `@typescript-eslint/no-floating-promises`: warn
  - `@typescript-eslint/no-unsafe-argument`: warn
  - Prettier end-of-line set to "auto"

### File Organization

**Web Package Structure**:
- `src/app/`: Next.js App Router pages and layouts
- `src/components/dashboard/`: Dashboard-specific React components
- `src/types/`: TypeScript type definitions
- `src/lib/`: Utility functions and shared logic
- Component files use `.tsx` extension
- Utility files use `.ts` extension

**API Package Structure**:
- `src/modules/`: Feature modules (e.g., llm, auth, users)
- `src/decorators/`: Custom decorators
- `src/main.ts`: Application entry point
- Use NestJS module organization patterns
- Controllers, services, and DTOs follow NestJS naming conventions

## Authentication

### NextAuth.js (Web)
- JWT-based session management with HTTP-only cookies
- Credentials provider integrating with backend API
- Session duration: 7 days
- Custom session types defined in `src/types/next-auth.d.ts`
- Role-based access control (teacher, student, admin)

**Usage Patterns**:

Client Components:
```typescript
import { useSession, signOut } from 'next-auth/react';

const { data: session, status } = useSession();
```

Server Components:
```typescript
import { getCurrentUser } from '@/lib/session';

const user = await getCurrentUser();
```

### Backend API (NestJS)
- JWT authentication with Passport
- Protected routes use JWT guards
- User roles and permissions managed in database

## Important Notes

### When Making Changes

1. **Preserve Existing Patterns**: Follow the established patterns in the codebase
2. **Type Safety**: Always maintain strong TypeScript typing
3. **Testing**: Run appropriate tests after changes (unit/e2e)
4. **Linting**: Ensure code passes ESLint checks before committing
5. **Documentation**: Update relevant README files if changing setup or architecture

### Environment Configuration

**Web Package** requires `.env.local`:
```bash
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**API Package** requires environment variables for:
- Database connection (PostgreSQL)
- JWT secret
- AWS S3 credentials
- Google AI API key

### Dependencies

- Use `pnpm add` to add dependencies (never npm or yarn)
- Add to appropriate workspace package (web, api, or shared)
- For shared dependencies, add to root package.json
- Check package.json for catalog references (e.g., `typescript: "catalog:"`)

### Common Patterns

1. **Import from shared package**: `import { ... } from '@ikasi-ai/shared'`
2. **Next.js client components**: Use `'use client'` directive at top of file
3. **NestJS modules**: Follow module/controller/service/dto structure
4. **React components**: Functional components with TypeScript interfaces for props
5. **Async operations**: Use async/await, not promises with .then()

## Testing

- **API**: Jest for unit and e2e tests
- Test files use `.spec.ts` suffix
- Run tests before committing significant changes
- Aim for good test coverage on business logic

## Deployment

- Web app builds for production with `next build --webpack`
- API builds with `nest build`
- Both packages can run in Docker (docker-compose.yml available)

## References

- See `web/README.md` for detailed frontend setup
- See `web/NEXTAUTH_GUIDE.md` for authentication details
- See `api/README.md` for NestJS backend information
- NestJS documentation: https://docs.nestjs.com
- Next.js documentation: https://nextjs.org/docs
