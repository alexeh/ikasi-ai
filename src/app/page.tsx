'use client';

import * as React from 'react';
import { GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  React.useEffect(() => {
    // Redirect to a default subject page, for example Euskera
    router.push('/euskera');
  }, [router]);

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="text-center">
        <GraduationCap className="mx-auto h-24 w-24 text-primary" />
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Ongi etorri Ikasgelara!
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Aukeratu irakasgai bat hasteko.
        </p>
      </div>
    </div>
  );
}
