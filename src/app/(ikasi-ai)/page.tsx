'use client';

import { LoginForm } from '@/components/LoginForm';

export default function LoginPage() {
  // This page will now *only* be responsible for showing the login form.
  // The redirection logic for an already logged-in user will be handled
  // in the main layout/sidebar component.
  return <LoginForm />;
}

