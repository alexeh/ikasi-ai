'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';

type UserRole = 'admin' | 'student';

const getSimulatedUserEmail = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('simulated_user');
};

export function useUserRole(): {
  role: UserRole | null;
  isLoading: boolean;
  email: string | null;
} {
  const { isUserLoading: isFirebaseUserLoading } = useUser();
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedEmail = getSimulatedUserEmail();
      setEmail(storedEmail);
    };

    handleStorageChange(); // Initial check

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (isFirebaseUserLoading) {
      setIsLoading(true);
      return;
    }

    if (email) {
      // Determine role based on email without any database queries
      setRole(email === 'jarambarri@aldapeta.eus' ? 'admin' : 'student');
    } else {
      setRole(null);
    }
    
    setIsLoading(false);

  }, [email, isFirebaseUserLoading]);

  return { role, isLoading, email };
}
