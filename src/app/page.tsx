'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { LoginForm } from '@/components/LoginForm';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // If the Firebase user object exists, it means we have an active session.
    // The useUserRole hook will determine the actual role and grant access.
    if (user) {
      router.push('/euskera');
    }
  }, [user, router]);
  

  if (isUserLoading || user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        {user && <p className="ml-4">Redirigiendo...</p>}
      </div>
    );
  }

  // If no user session, show the login form.
  return <LoginForm />;
}
