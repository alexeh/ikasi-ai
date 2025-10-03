'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';

type UserRole = 'admin' | 'student';

// This is a temporary solution for the simplified login
const getSimulatedUser = (): { uid: string; email: string } | null => {
    if (typeof window === 'undefined') return null;
    const email = localStorage.getItem('simulated_user');
    if (!email) return null;
    // We'll use the email as a fake UID for checking the admin role.
    // In a real scenario, this would come from the auth token.
    // A simple hash function to generate a consistent "uid" for the teacher.
    const uid = email === 'jarambarri@aldapeta.eus' ? 'jarambarri_aldapeta_eus' : email;
    return { uid, email };
}


export function useUserRole(): { role: UserRole | null; isLoading: boolean; email: string | null } {
  const { user: firebaseUser, isUserLoading: isFirebaseUserLoading } = useUser();
  const [simulatedUser, setSimulatedUser] = useState<{ uid: string; email: string } | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // This effect runs ONLY on the client, after the initial render.
    // This avoids the hydration mismatch.
    const user = getSimulatedUser();
    setSimulatedUser(user);

    const handleStorageChange = () => {
        setSimulatedUser(getSimulatedUser());
    }
    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  useEffect(() => {
    setIsLoading(isFirebaseUserLoading);

    if (isFirebaseUserLoading) {
      return;
    }

    if (!firebaseUser || !simulatedUser) {
      setRole(null);
      setIsLoading(false);
      return;
    }
    
    // Determine role based on the simulated user's email
    // This is now the ONLY place where the role is determined. No DB calls.
    if (simulatedUser.email === 'jarambarri@aldapeta.eus') {
      setRole('admin');
    } else {
      setRole('student');
    }
    setIsLoading(false);

  }, [firebaseUser, isFirebaseUserLoading, simulatedUser]);

  return { role, isLoading, email: simulatedUser?.email || null };
}
