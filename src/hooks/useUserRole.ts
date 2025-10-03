'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useMemoFirebase } from '@/firebase/provider';

type UserRole = 'admin' | 'student';

export function useUserRole(): { role: UserRole | null; isLoading: boolean } {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const roleDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'roles_admin', user.uid) : null),
    [firestore, user]
  );
  
  const { data: adminDoc, isLoading: isAdminDocLoading } = useDoc(roleDocRef);

  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isUserLoading || isAdminDocLoading) {
      setIsLoading(true);
      return;
    }

    if (!user) {
      setRole(null);
      setIsLoading(false);
      return;
    }

    if (adminDoc) {
      setRole('admin');
    } else {
      setRole('student');
    }
    setIsLoading(false);
  }, [user, isUserLoading, adminDoc, isAdminDocLoading]);

  return { role, isLoading };
}
