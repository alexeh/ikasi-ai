'use client';

import * as React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const miniApps = [
  {
    title: 'El Cuentacuentos',
    description: 'Crea el inicio de una historia y continúa escribiendo.',
    href: '/gaztelania/el-cuentacuentos',
  },
  {
    title: 'Comprensión Lectora',
    description: 'Lee textos y responde a las preguntas.',
    href: '/gaztelania/lectura',
  },
];

export default function GaztelaniaHomePage() {
  return (
    <div className="container py-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-headline font-bold">Gaztelania</h1>
                <p className="mt-2 text-muted-foreground">
                    Elige una actividad para empezar.
                </p>
            </div>
            <Button variant="outline">
                <BarChart className="mr-2 h-4 w-4" />
                Estatistikak
            </Button>
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
