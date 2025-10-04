'use client';

import * as React from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { useRouter } from 'next/navigation';
import { Loader2, User, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart2 } from 'lucide-react';

const allowedUsers = [
  'jarambarri@aldapeta.eus',
  'alejandro.hernandez@aldapeta.eus',
  'alma.ruizdearcaute@aldapeta.eus',
  'amets.olaizola@aldapeta.eus',
  'daniel.irazusta@aldapeta.eus',
  'diego.valcarce@aldapeta.eus',
  'elia.virto@aldapeta.eus',
  'julen.povieda@aldapeta.eus',
  'lola.altolaguirre@aldapeta.eus',
  'lucia.benali@aldapeta.eus',
  'lucia.manzano@aldapeta.eus',
  'luis.oliveira@aldapeta.eus',
  'lukas.usarraga@aldapeta.eus',
  'manuela.demora@aldapeta.eus',
  'marina.ortuzar@aldapeta.eus',
  'martin.aizpurua@aldapeta.eus',
  'martin.ceceaga@aldapeta.eus',
  'martin.contreras@aldapeta.eus',
  'martin.cuenca@aldapeta.eus',
  'martin.garcia@aldapeta.eus',
  'martin.iturralde@aldapeta.eus',
  'oto.fermin@aldapeta.eus',
  'sara.padilla@aldapeta.eus',
  'simon.fernandez@aldapeta.eus',
];

const formatEmailToName = (email: string) => {
    if (!email) return '';
    const namePart = email.split('@')[0];
    return namePart.split('.').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
}

const getLastName = (email: string) => {
    if (!email) return '';
    const namePart = email.split('@')[0];
    const names = namePart.split('.');
    return names.length > 1 ? names[1] : names[0];
}

export default function StudentListPage() {
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
                <ShieldAlert className="h-12 w-12 text-destructive" />
                <h1 className="text-2xl font-bold mt-4">Sarrera debekatua</h1>
                <p className="text-muted-foreground mt-2">
                    Ez duzu baimenik orri hau ikusteko.
                </p>
                <Button onClick={() => router.push('/')} variant="outline" className="mt-6">
                    Itzuli hasierara
                </Button>
            </div>
        );
    }
    
    const students = allowedUsers
      .filter(email => email !== 'jarambarri@aldapeta.eus')
      .sort((a, b) => getLastName(a).localeCompare(getLastName(b)));
    
    return (
        <div className="container py-8">
             <Button onClick={() => router.push('/irakasleak')} variant="outline" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Itzuli panelera
            </Button>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Ikasleen Zerrenda</h1>
                    <p className="mt-2 text-muted-foreground">
                        Hautatu ikasle bat bere estatistikak ikusteko.
                    </p>
                </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {students.map((studentEmail) => (
                    <Link href={`/irakasleak/estatistikak/${encodeURIComponent(studentEmail)}`} key={studentEmail}>
                        <Card className="flex h-full transform-gpu flex-col transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    <User className="mt-1 h-8 w-8 text-primary"/>
                                    <div>
                                        <CardTitle>{formatEmailToName(studentEmail)}</CardTitle>
                                        <CardDescription>{studentEmail}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardFooter>
                                <Button variant="secondary" className="w-full">
                                    <BarChart2 className="mr-2 h-4 w-4" />
                                    Ikusi estatistikak
                                </Button>
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
