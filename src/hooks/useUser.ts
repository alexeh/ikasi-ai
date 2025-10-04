'use client';

import { useState, useEffect } from 'react';

export function useUser() {
  const [user, setUser] = useState<string | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in via localStorage
    const storedUser = localStorage.getItem('simulated_user');
    setUser(storedUser);
    setIsUserLoading(false);

    // Listen for storage changes
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('simulated_user');
      setUser(storedUser);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { user, isUserLoading };
}
