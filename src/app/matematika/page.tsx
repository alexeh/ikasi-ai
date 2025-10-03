'use client';
import { Button } from '@/components/ui/button';
import { BarChart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserRole } from '@/hooks/useUserRole';

const miniApps = [
  {
    title: 'Kalkulu Mentala',
    description: 'Entrenatu zure burua matematikako eragiketekin.',
    href: '/matematika/kalkulu-mentala',
  },
];


export default function MatematikaPage() {
  const { role } = useUserRole();
  return (
    <div className="container py-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-headline font-bold">Matematika</h1>
                <p className="text-muted-foreground mt-2">
                    Hemen Matematikako ariketak aurkituko dituzu.
                </p>
            </div>
            {role === 'admin' && (
              <Button asChild variant="outline">
                <Link href="/irakasleak/estatistikak">
                  <BarChart className="mr-2 h-4 w-4" />
                  Estatistikak
                </Link>
              </Button>
            )}
        </div>

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
