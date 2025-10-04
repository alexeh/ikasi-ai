# ikasi-ai

A modern Next.js application with Tailwind CSS, Supabase backend integration, and full CI/CD pipeline.

## Features

- ⚡ **Next.js 15** with App Router and React 19
- 🎨 **Tailwind CSS v4** for styling
- 🗄️ **Supabase** for backend and authentication
- 🧪 **Jest & React Testing Library** for testing
- 📏 **ESLint & Prettier** for code quality
- 🚀 **Vercel** deployment ready
- 🔄 **GitHub Actions** for CI/CD
- 📝 **TypeScript** for type safety

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm or yarn
- A Supabase account (sign up at [supabase.com](https://supabase.com))
- A Vercel account (optional, for deployment)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/alexeh/ikasi-ai.git
cd ikasi-ai
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## Supabase Setup

### Local Development

1. Install Supabase CLI:

```bash
npm install -g supabase
```

2. Initialize Supabase:

```bash
supabase init
```

3. Start local Supabase:

```bash
supabase start
```

4. Run migrations:

```bash
supabase db push
```

### Production Deployment

1. Create a new project on [Supabase](https://app.supabase.com)
2. Link your local project:

```bash
supabase link --project-ref your-project-ref
```

3. Push migrations:

```bash
supabase db push
```

## Vercel Deployment

### Initial Setup

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy to Vercel:

```bash
vercel
```

3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Automatic Deployment

Push to the `main` branch to trigger automatic deployment via GitHub Actions.

## CI/CD Pipeline

The project includes a GitHub Actions workflow that:

1. Runs linting and formatting checks
2. Executes all tests
3. Builds the application
4. Deploys to Vercel (on main branch)
5. Deploys Supabase migrations (on main branch)

### Required GitHub Secrets

Add these secrets to your GitHub repository:

- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- `SUPABASE_ACCESS_TOKEN` - Supabase access token
- `SUPABASE_PROJECT_ID` - Supabase project reference

## Project Structure

```
ikasi-ai/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # CI/CD pipeline
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   └── supabase.ts        # Supabase client
│   └── __tests__/             # Test files
├── supabase/
│   ├── migrations/            # Database migrations
│   └── config.toml            # Supabase config
├── .env.example               # Environment variables template
├── jest.config.ts             # Jest configuration
├── jest.setup.ts              # Jest setup
├── .prettierrc                # Prettier configuration
├── eslint.config.mjs          # ESLint configuration
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── vercel.json                # Vercel configuration
```

## Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Code Quality

Format code:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

Lint code:

```bash
npm run lint
```

Fix linting issues:

```bash
npm run lint:fix
```

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
