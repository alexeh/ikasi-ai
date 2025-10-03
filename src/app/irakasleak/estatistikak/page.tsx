'use client';

import * as React from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useUserRole } from '@/hooks/useUserRole';
import { useRouter } from 'next/navigation';
import { BarChart, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMemoFirebase } from '@/firebase';

type MentalMathGame = {
    id: string;
    studentEmail: string;
    level: string;
    score: number;
    incorrectAnswers: number;
    timestamp: {
        toDate: () => Date;
    };
};

export default function EstatistikakPage() {
    const firestore = useFirestore();
    const { role, isLoading: isRoleLoading } = useUserRole();
    const router = useRouter();

    const gamesQuery = useMemoFirebase(
        () => 
            firestore && role === 'admin'
            ? query(collection(firestore, 'mentalMathGames'), orderBy('timestamp', 'desc'))
            : null,
        [firestore, role]
    );

    const { data: games, isLoading: isGamesLoading } = useCollection<MentalMathGame>(gamesQuery);

    React.useEffect(() => {
        if (!isRoleLoading && role !== 'admin') {
            router.push('/');
        }
    }, [role, isRoleLoading, router]);

    const isLoading = isRoleLoading || isGamesLoading;

    if (isLoading || role !== 'admin') {
        return (
            <div className="container flex h-[calc(100vh-theme(spacing.14))] items-center justify-center py-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="container py-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Estatistikak</h1>
                    <p className="mt-2 text-muted-foreground">
                        Hemen ikasleen emaitzak ikus ditzakezu.
                    </p>
                </div>
            </div>

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Kalkulu Mentalaren Emaitzak</CardTitle>
                    <CardDescription>Jokatutako partida guztien zerrenda.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ikaslea</TableHead>
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
                                        <TableCell className="font-medium">{game.studentEmail}</TableCell>
                                        <TableCell>{game.timestamp.toDate().toLocaleDateString()}</TableCell>
                                        <TableCell>{game.level}</TableCell>
                                        <TableCell className="text-right text-green-600">{game.score}</TableCell>
                                        <TableCell className="text-right text-red-600">{game.incorrectAnswers}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        Oraindik ez dago emaitzarik.
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
