'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';

type UserRole = 'admin' | 'student';

// This is a temporary solution for the simplified login
const getSimulatedUser = (): { email: string } | null => {
  if (typeof window === 'undefined') return null;
  const email = localStorage.getItem('simulated_user');
  if (!email) return null;
  return { email };
};

export function useUserRole(): {
  role: UserRole | null;
  isLoading: boolean;
  email: string | null;
} {
  const { user: firebaseUser, isUserLoading: isFirebaseUserLoading } = useUser();
  const [simulatedUser, setSimulatedUser] = useState<{ email: string } | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect runs on the client to get the simulated user from localStorage.
    const user = getSimulatedUser();
    setSimulatedUser(user);

    // Also listen for storage changes (e.g., if the user logs out in another tab)
    const handleStorageChange = () => {
      setSimulatedUser(getSimulatedUser());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // This effect determines the user's role based on email.
    // It does NOT perform any database queries.

    setIsLoading(isFirebaseUserLoading);

    if (isFirebaseUserLoading) {
      // If we are still waiting for Firebase to confirm the user, do nothing.
      return;
    }

    if (!firebaseUser || !simulatedUser) {
      // If there's no Firebase user or no simulated user from localStorage,
      // they have no role.
      setRole(null);
      setIsLoading(false);
      return;
    }

    // Determine role based on the stored email. This is secure and fast.
    if (simulatedUser.email === 'jarambarri@aldapeta.eus') {
      setRole('admin');
    } else {
      setRole('student');
    }
    setIsLoading(false);
  }, [firebaseUser, isFirebaseUserLoading, simulatedUser]);

  return { role, isLoading, email: simulatedUser?.email || null };
}
