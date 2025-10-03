'use client';

import * as React from 'react';
import Link from 'next/link';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useUserRole } from '@/hooks/useUserRole';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';

type MentalMathGame = {
    id: string;
    studentId: string;
    studentEmail: string;
    level: string;
    score: number;
    incorrectAnswers: number;
    timestamp: {
        toDate: () => Date;
    };
};

const formatIdToName = (id: string) => {
    if (!id) return '';
    const email = id.replace(/_/g, '.').replace('aldapeta.eus', '@aldapeta.eus');
    const namePart = email.split('@')[0];
    return namePart.split('.').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
};

const levelTranslations: { [key: string]: string } = {
    easy: 'Erraza',
    medium: 'Normala',
    hard: 'Zaila',
};

export default function StudentMathStatisticsPage() {
    const firestore = useFirestore();
    const { role, isLoading: isRoleLoading } = useUserRole();
    const router = useRouter();
    const params = useParams();
    const studentId = typeof params.studentId === 'string' ? params.studentId : '';
    const studentName = formatIdToName(studentId);

    const studentEmail = studentId.replace(/_/g, '.').replace('aldapeta.eus', '@aldapeta.eus');

    const gamesQuery = useMemoFirebase(
        () => 
            firestore && role === 'admin' && studentEmail
            ? query(
                collection(firestore, 'mentalMathGames'), 
                where('studentEmail', '==', studentEmail),
                orderBy('timestamp', 'desc')
              )
            : null,
        [firestore, role, studentEmail]
    );

    const { data: games, isLoading: isGamesLoading } = useCollection<MentalMathGame>(gamesQuery);
    
    const isLoading = isRoleLoading || isGamesLoading;

    if (isLoading) {
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
               <button onClick={() => router.push('/')} className="mt-4 text-primary underline">
                   Itzuli hasierara
               </button>
           </div>
       );
   }
    
    return (
        <div className="container py-8">
            <div className="mb-8">
                <Button asChild variant="outline">
                    <Link href={`/irakasleak/estatistikak/${studentId}`}>
                         <ArrowLeft className="mr-2 h-4 w-4" />
                        Itzuli
                    </Link>
                </Button>
                <h1 className="text-3xl font-headline font-bold mt-4">
                    Kalkulu Mentala - {studentName}
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Hemen ikaslearen emaitzak ikus ditzakezu.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Partiden historiala</CardTitle>
                    <CardDescription>Jokatutako partida guztien zerrenda.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Maila</TableHead>
                                <TableHead className="text-right">Zuzenak</TableHead>
                                <TableHead className="text-right">Okerrak</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {games && games.length > 0 ? (
                                games.map((game) => (
                                    <TableRow key={game.id}>
                                        <TableCell>{game.timestamp.toDate().toLocaleDateString('eu-ES')}</TableCell>
                                        <TableCell>{levelTranslations[game.level] || game.level}</TableCell>
                                        <TableCell className="text-right font-medium text-green-600">{game.score}</TableCell>
                                        <TableCell className="text-right font-medium text-red-600">{game.incorrectAnswers}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Ikasle honek ez du oraindik jokatu.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
