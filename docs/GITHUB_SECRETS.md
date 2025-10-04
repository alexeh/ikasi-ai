# GitHub Secrets Setup

This document explains how to configure the required GitHub Secrets for the CI/CD pipeline.

## Required Secrets

### Vercel Deployment

1. **VERCEL_TOKEN**
   - Go to [Vercel Account Settings](https://vercel.com/account/tokens)
   - Click "Create Token"
   - Give it a name (e.g., "GitHub Actions")
   - Copy the token and add it to GitHub Secrets

2. **VERCEL_ORG_ID**
   - Install Vercel CLI: `npm install -g vercel`
   - Run `vercel link` in your project directory
   - Your Org ID will be in `.vercel/project.json` as `orgId`

3. **VERCEL_PROJECT_ID**
   - After running `vercel link`
   - Your Project ID will be in `.vercel/project.json` as `projectId`

### Supabase Deployment

1. **SUPABASE_ACCESS_TOKEN**
   - Go to [Supabase Account Settings](https://app.supabase.com/account/tokens)
   - Click "Generate New Token"
   - Give it a name (e.g., "GitHub Actions")
   - Copy the token and add it to GitHub Secrets

2. **SUPABASE_PROJECT_ID**
   - Go to your [Supabase Project Settings](https://app.supabase.com/project/_/settings/general)
   - Find "Reference ID" under Project Settings
   - Copy and add it to GitHub Secrets

## Adding Secrets to GitHub

1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, click "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add each secret with its name and value

## Environment Variables for Local Development

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

These values can be found in your Supabase project settings under API.

## Testing the CI/CD Pipeline

After adding all secrets:

1. Push to a feature branch
2. Create a Pull Request to `main`
3. The CI pipeline should run automatically
4. Merge to `main` to trigger deployment

## Security Notes

- Never commit secrets to the repository
- Rotate tokens regularly
- Use least-privilege access for tokens
- Monitor GitHub Actions logs for any issues
