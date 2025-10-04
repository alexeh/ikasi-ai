'use client';

import * as React from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const panelItems = [
  {
    title: 'Ikasleen Estatistikak',
    description: 'Ikusi ikasle bakoitzaren aurrerapena eta emaitzak.',
    href: '/irakasleak/estatistikak',
    icon: <Users />,
  },
];

export default function IrakasleakPage() {
  const { role, isLoading: isRoleLoading } = useUserRole();
  const router = useRouter();

  if (isRoleLoading) {
    return (
      <div className="container flex h-[calc(100vh-theme(spacing.14))] items-center justify-center py-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (role !== 'admin') {
    return (
      <div className="container flex flex-col h-[calc(100vh-theme(spacing.14))] items-center justify-center py-8 text-center">
        <h1 className="text-2xl font-bold">Sarrera debekatua</h1>
        <p className="text-muted-foreground mt-2">
          Ez duzu baimenik orri hau ikusteko.
        </p>
        <Button onClick={() => router.push('/')} variant="outline" className="mt-4">
          Itzuli hasierara
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Irakasleentzako Panela</h1>
          <p className="mt-2 text-muted-foreground">
            Hemen zure tresnak eta estatistikak aurkituko dituzu.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {panelItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <Card className="flex h-full transform-gpu flex-col transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
              <CardHeader className="flex-1">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-md">
                    {item.icon}
                  </div>
                  <div>
                    <CardTitle className="flex items-center justify-between">
                      {item.title}
                    </CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
