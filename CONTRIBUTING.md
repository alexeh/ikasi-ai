# Contributing to ikasi-ai

Thank you for your interest in contributing to ikasi-ai! This document provides guidelines and instructions for contributing to this project.

## Development Setup

1. **Fork and Clone**

   ```bash
   git clone https://github.com/YOUR_USERNAME/ikasi-ai.git
   cd ikasi-ai
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**

   ```bash
   cp .env.example .env.local
   ```

   Add your Supabase credentials to `.env.local`

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Code Quality Standards

### Linting

We use ESLint to maintain code quality. Before committing:

```bash
npm run lint
npm run lint:fix  # to automatically fix issues
```

### Formatting

We use Prettier for consistent code formatting:

```bash
npm run format        # format all files
npm run format:check  # check formatting without changes
```

### Testing

All code should be tested:

```bash
npm test              # run all tests
npm run test:watch    # run tests in watch mode
npm run test:coverage # run tests with coverage report
```

## Git Workflow

1. Create a feature branch from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

3. Push to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request to the `main` branch

### Commit Message Convention

We follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Follow the code style guidelines
4. Request review from maintainers
5. Address review feedback

## Development Guidelines

### TypeScript

- Use TypeScript for all new files
- Avoid `any` types when possible
- Define interfaces for complex data structures

### React Components

- Use functional components with hooks
- Keep components small and focused
- Add proper TypeScript types for props

### Testing

- Write tests for new features
- Maintain test coverage above 80%
- Test edge cases and error handling

### Styling

- Use Tailwind CSS utility classes
- Follow the existing design system
- Ensure responsive design for mobile devices

## Project Structure

```
src/
├── app/           # Next.js App Router pages
├── lib/           # Utility functions and shared code
├── __tests__/     # Test files
└── components/    # Reusable React components (add as needed)
```

## Database Migrations

When adding database changes:

1. Create a new migration file:

   ```bash
   cd supabase/migrations
   touch YYYYMMDDHHMMSS_description.sql
   ```

2. Write your SQL migration

3. Test locally:
   ```bash
   supabase db reset  # resets and applies all migrations
   ```

## Questions or Issues?

- Open an issue for bugs or feature requests
- Join discussions for questions
- Contact maintainers for security issues

Thank you for contributing! 🎉
