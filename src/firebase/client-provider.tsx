'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

interface FirebaseServices {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export function FirebaseClientProvider({
  children,
}: FirebaseClientProviderProps) {
  const [firebaseServices, setFirebaseServices] =
    useState<FirebaseServices | null>(null);

  useEffect(() => {
    // This effect runs only on the client, after initial render.
    // This is where we safely initialize Firebase.
    if (typeof window !== 'undefined') {
      setFirebaseServices(initializeFirebase());
    }
  }, []); // Empty dependency array ensures this runs only once

  if (!firebaseServices) {
    // While Firebase is initializing, you can show a loader
    // or just return null if the un-rendered state is acceptable.
    // Returning null is often fine if the children don't strictly
    // depend on Firebase being available on the very first frame.
    return null;
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
