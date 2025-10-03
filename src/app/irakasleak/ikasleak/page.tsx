'use client';

import * as React from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { useRouter } from 'next/navigation';
import { Loader2, User, BarChart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

// Simple function to format email to name
const formatEmailToName = (email: string) => {
    const namePart = email.split('@')[0];
    return namePart.split('.').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
}


export default function IkasleakPage() {
    const { role, isLoading: isRoleLoading } = useUserRole();
    const router = useRouter();

    React.useEffect(() => {
        if (!isRoleLoading && role !== 'admin') {
            router.push('/');
        }
    }, [role, isRoleLoading, router]);

    if (isRoleLoading || role !== 'admin') {
        return (
            <div className="container flex h-[calc(100vh-theme(spacing.14))] items-center justify-center py-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    const students = allowedUsers.filter(email => email !== 'jarambarri@aldapeta.eus');
    
    return (
        <div className="container py-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Ikasleak</h1>
                    <p className="mt-2 text-muted-foreground">
                        Hemen zure ikasleen zerrenda ikus dezakezu.
                    </p>
                </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {students.map(studentEmail => (
                    <Card key={studentEmail}>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <User className="h-8 w-8 text-primary"/>
                                <div>
                                    <CardTitle>{formatEmailToName(studentEmail)}</CardTitle>
                                    <CardDescription>{studentEmail}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardFooter>
                            <Button asChild className="w-full" variant="outline">
                                <Link href="/irakasleak/estatistikak">
                                    <BarChart className="mr-2 h-4 w-4" />
                                    Ikusi estatistikak
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
