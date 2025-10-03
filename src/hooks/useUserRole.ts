'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';

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
  const firestore = useFirestore();
  const [simulatedUser, setSimulatedUser] = useState<{ uid: string; email: string } | null>(null);

  useEffect(() => {
    // This effect runs ONLY on the client, after the initial render.
    // This avoids the hydration mismatch.
    setSimulatedUser(getSimulatedUser());

    const handleStorageChange = () => {
        setSimulatedUser(getSimulatedUser());
    }
    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  const roleDocRef = useMemoFirebase(
    () => (firestore && simulatedUser ? doc(firestore, 'roles_admin', simulatedUser.uid) : null),
    [firestore, simulatedUser]
  );
  
  const { data: adminDoc, isLoading: isAdminDocLoading } = useDoc(roleDocRef);

  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // The "real" loading state depends on both firebase auth and our simulated user logic.
    const overallIsLoading = isFirebaseUserLoading || isAdminDocLoading;
    setIsLoading(overallIsLoading);

    if (overallIsLoading) {
      return;
    }

    if (!firebaseUser || !simulatedUser) {
      setRole(null);
      return;
    }
    
    // Check for admin role using the fake UID 'jarambarri_aldapeta_eus'
    if (simulatedUser.email === 'jarambarri@aldapeta.eus') {
      setRole('admin');
    } else {
      setRole('student');
    }
  }, [firebaseUser, isFirebaseUserLoading, adminDoc, isAdminDocLoading, simulatedUser]);

  return { role, isLoading, email: simulatedUser?.email || null };
}
