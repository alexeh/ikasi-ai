import { DatabaseZap } from 'lucide-react';
import React from 'react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <DatabaseZap className="h-8 w-8 text-primary" />
      <h1 className="text-2xl font-headline font-bold tracking-tight text-foreground">
        SyncSphere
      </h1>
    </div>
  );
}
