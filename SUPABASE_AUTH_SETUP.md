# Supabase Authentication Setup Guide

This document describes how to set up Supabase authentication for the ikasi-ai application.

## Changes Made

The application has been updated to use Supabase authentication instead of localStorage-based authentication:

1. **Login Form** - Added password field and integrated with Supabase Auth
2. **User Hook** - Updated to track Supabase session state
3. **Logout** - Uses Supabase signOut method

## Environment Variables Required

Add these environment variables to your deployment (Vercel, .env.local, etc.):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in your Supabase project:
1. Go to https://app.supabase.com
2. Select your project
3. Go to Settings > API
4. Copy the "Project URL" and "anon/public" key

## Setting Up Users

Since the application previously had a hardcoded list of allowed users, you'll need to create accounts for each user in Supabase:

### Option 1: Manual User Creation (Recommended for Initial Setup)

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add User"
4. Enter the email and create a password
5. Repeat for all users

### Option 2: Email Invitation Flow

1. Set up email templates in Supabase (Authentication > Email Templates)
2. Enable email confirmations if desired
3. Use Supabase Auth UI or custom signup flow to let users register

### Previously Allowed Users

The following emails were previously in the `allowedUsers` array and should be added to Supabase:

- jarambarri@aldapeta.eus
- alejandro.hernandez@aldapeta.eus
- alma.ruizdearcaute@aldapeta.eus
- amets.olaizola@aldapeta.eus
- daniel.irazusta@aldapeta.eus
- diego.valcarce@aldapeta.eus
- elia.virto@aldapeta.eus
- julen.povieda@aldapeta.eus
- lola.altolaguirre@aldapeta.eus
- lucia.benali@aldapeta.eus
- lucia.manzano@aldapeta.eus
- luis.oliveira@aldapeta.eus
- lukas.usarraga@aldapeta.eus
- manuela.demora@aldapeta.eus
- marina.ortuzar@aldapeta.eus
- martin.aizpurua@aldapeta.eus
- martin.ceceaga@aldapeta.eus
- martin.contreras@aldapeta.eus
- martin.cuenca@aldapeta.eus
- martin.garcia@aldapeta.eus
- martin.iturralde@aldapeta.eus
- oto.fermin@aldapeta.eus
- sara.padilla@aldapeta.eus
- simon.fernandez@aldapeta.eus

## Admin Role Setup

The application checks for admin role using the email `jarambarri@aldapeta.eus`. You may want to:

1. Add user metadata in Supabase for roles
2. Update `src/hooks/useUserRole.ts` to read from user metadata instead of hardcoded email

To add metadata:
1. Go to Authentication > Users
2. Click on the user
3. Add custom data in the "User Metadata" section:
   ```json
   {
     "role": "admin"
   }
   ```

## Testing Locally

1. Create a `.env.local` file in the project root
2. Add your Supabase credentials
3. Run `npm run dev`
4. Navigate to http://localhost:9002
5. Try logging in with a test user

## Security Notes

- Passwords are securely handled by Supabase Auth
- The anon key is safe to expose in client-side code
- Implement Row Level Security (RLS) policies in Supabase for database access
- Consider enabling email verification for production
- Set up password reset flow using Supabase Auth

## Migration from localStorage

Users who were previously logged in using localStorage will need to:
1. Log in again with their Supabase credentials
2. Their localStorage session will be ignored

## Next Steps

1. Set up Supabase project
2. Add environment variables to Vercel/deployment
3. Create user accounts
4. Test authentication flow
5. Set up email templates for password reset
6. Consider implementing Row Level Security for database operations
