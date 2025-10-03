'use client';

import * as React from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, BrainCircuit, Puzzle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from 'date-fns';
import { es } from 'date-fns/locale';


const formatIdToEmail = (id: string) => {
    return id.replace(/_/g, '.').replace(/\.eus$/, '@aldapeta.eus');
}

const formatEmailToName = (email: string) => {
    if (!email) return '';
    const namePart = email.split('@')[0];
    return namePart.split('.').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
}


type MentalMathGame = {
    id: string;
    level: 'easy' | 'medium' | 'hard';
    score: number;
    incorrectAnswers: number;
    timestamp: {
        toDate: () => Date;
    }
};

type MathWordProblemGame = {
    id: string;
    level: 'easy' | 'medium' | 'hard';
    topic: string;
    problem: string;
    userAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    timestamp: {
        toDate: () => Date;
    }
}


export default function StudentMathStatsPage() {
    const { role, isLoading: isRoleLoading } = useUserRole();
    const router = useRouter();
    const firestore = useFirestore();
    const params = useParams();
    const studentId = params.studentId as string;

    const studentEmail = React.useMemo(() => formatIdToEmail(studentId), [studentId]);
    const studentName = React.useMemo(() => formatEmailToName(studentEmail), [studentEmail]);
    
    // TEMPORARY: Return null for mentalMathGames to avoid query issues
    const mentalMathGames: MentalMathGame[] | null = null;
    const isLoadingMentalMath = false;

    const wordProblemsQuery = useMemoFirebase(
        () =>
            firestore && studentEmail
            ? query(
                collection(firestore, 'mathWordProblemGames'),
                where('studentEmail', '==', studentEmail),
                orderBy('timestamp', 'desc')
              )
            : null,
        [firestore, studentEmail]
    );
    const { data: wordProblemGames, isLoading: isLoadingWordProblems } = useCollection<MathWordProblemGame>(wordProblemsQuery);


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

    const chartData = mentalMathGames?.map(game => ({
        date: format(game.timestamp.toDate(), 'dd/MM'),
        Zuzenak: game.score,
        Okerrak: game.incorrectAnswers,
    })).reverse();

    const isLoading = isLoadingMentalMath || isLoadingWordProblems;

    return (
         <div className="container py-8">
            <Button onClick={() => router.back()} variant="outline" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Itzuli ikasleen zerrendara
            </Button>
            <h1 className="text-3xl font-headline font-bold">
                {studentName} - Matematikako estatistikak
            </h1>
            <p className="mt-2 text-muted-foreground">
                Hemen ikaslearen aurrerapena ikus dezakezu.
            </p>

            {isLoading && (
                 <div className="mt-8 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-2">Estatistikak kargatzen...</p>
                </div>
            )}

            {!isLoading && (
                 <div className="mt-8 space-y-8">
                    <Card>
                        <CardHeader>
                            <div className='flex items-center gap-3'>
                                <BrainCircuit className='h-6 w-6 text-primary'/>
                                <div>
                                    <CardTitle>Kalkulu Mentala</CardTitle>
                                    <CardDescription>Azken jolasen emaitzak.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {mentalMathGames && mentalMathGames.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Zuzenak" fill="hsl(var(--primary))" />
                                    <Bar dataKey="Okerrak" fill="hsl(var(--destructive))" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className='text-sm text-muted-foreground text-center py-8'>Ez dago Kalkulu Mentaleko jolasen daturik erregistratuta.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                         <CardHeader>
                            <div className='flex items-center gap-3'>
                                <Puzzle className='h-6 w-6 text-primary'/>
                                <div>
                                    <CardTitle>Buruketak</CardTitle>
                                    <CardDescription>Ebatzi dituen azken buruketen historiala.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {wordProblemGames && wordProblemGames.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Gaia</TableHead>
                                        <TableHead>Buruketa</TableHead>
                                        <TableHead className='text-center'>Emaitza</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {wordProblemGames.map(game => (
                                            <TableRow key={game.id}>
                                                <TableCell>{format(game.timestamp.toDate(), 'dd/MM/yy HH:mm')}</TableCell>
                                                <TableCell>{game.topic}</TableCell>
                                                <TableCell className="max-w-xs truncate">{game.problem}</TableCell>
                                                <TableCell className="text-center">
                                                    {game.isCorrect ? (
                                                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                                                    ) : (
                                                         <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className='text-sm text-muted-foreground text-center py-8'>Ez dago Buruketen daturik erregistratuta.</p>
                            )}
                        </CardContent>
                    </Card>
                 </div>
            )}
         </div>
    );

}
