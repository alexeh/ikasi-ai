'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';

type UserRole = 'admin' | 'student';

// This is a temporary solution for the simplified login
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
      setEmail(getSimulatedUserEmail());
    };
    
    // Set initial email
    handleStorageChange();

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
      if (email === 'jarambarri@aldapeta.eus') {
        setRole('admin');
      } else {
        setRole('student');
      }
    } else {
      setRole(null);
    }
    
    setIsLoading(false);

  }, [email, isFirebaseUserLoading]);

  return { role, isLoading, email };
}
