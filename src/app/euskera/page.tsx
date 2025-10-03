'use client';

import * as React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const miniApps = [
  {
    title: 'Ipuin Kontalaria',
    description: 'Sortu istorio baten hasiera eta jarraitu idazten.',
    href: '/euskera/ipuin-kontalaria',
  },
];

export default function EuskeraHomePage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-headline font-bold">Euskera</h1>
      <p className="mt-2 text-muted-foreground">
        Aukeratu jarduera bat hasteko.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {miniApps.map((app) => (
          <Link href={app.href} key={app.href}>
            <Card className="flex h-full transform-gpu flex-col transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
              <CardHeader className="flex-1">
                <CardTitle className="flex items-center justify-between">
                  {app.title}
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>{app.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
