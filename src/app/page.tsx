'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { LoginForm } from '@/components/LoginForm';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    router.push('/euskera');
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4">Redirigiendo...</p>
      </div>
    );
  }

  return <LoginForm />;
}
