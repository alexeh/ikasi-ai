'use client';

import * as React from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, ArrowLeft, BarChart, Trophy, Clock, XCircle, CheckCircle, Puzzle } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from "recharts"


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

const formatIdToEmail = (id: string) => {
    if (!id) return '';
    return id.replace(/_/g, '.');
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
    problemsAttempted: number;
    incorrectAnswers: number;
    duration: number;
    timestamp: {
        seconds: number;
        nanoseconds: number;
    };
}

type MathWordProblemGame = {
    id: string;
    level: 'easy' | 'medium' | 'hard';
    topic: string;
    problem: string;
    correctAnswer: number;
    userAnswer: number;
    isCorrect: boolean;
    timestamp: {
        seconds: number;
        nanoseconds: number;
    };
}


export default function StudentMathStatsPage() {
    const { role, isLoading: isRoleLoading } = useUserRole();
    const router = useRouter();
    const firestore = useFirestore();
    const params = useParams();
    const studentId = params.studentId as string;

    const studentEmail = React.useMemo(() => formatIdToEmail(studentId), [studentId]);
    const studentName = React.useMemo(() => formatEmailToName(studentEmail), [studentEmail]);

    const mentalMathGamesQuery = useMemoFirebase(
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

    const wordProblemGamesQuery = useMemoFirebase(
      () =>
        firestore && role === 'admin' && studentEmail
          ? query(
              collection(firestore, 'mathWordProblemGames'),
              where('studentEmail', '==', studentEmail),
              orderBy('timestamp', 'desc')
            )
          : null,
      [firestore, role, studentEmail]
    );

    const { data: mentalMathGames, isLoading: isMentalMathLoading } = useCollection<MentalMathGame>(mentalMathGamesQuery);
    const { data: wordProblemGames, isLoading: isWordProblemLoading } = useCollection<MathWordProblemGame>(wordProblemGamesQuery);
    
    const isGamesLoading = isMentalMathLoading || isWordProblemLoading;

    const chartData = React.useMemo(() => {
        if (!mentalMathGames) return [];
        return mentalMathGames.map(game => ({
            name: new Date(game.timestamp.seconds * 1000).toLocaleDateString(),
            Puntuazioa: game.score,
            Akatsak: game.incorrectAnswers,
        })).reverse();
    }, [mentalMathGames]);

    const chartConfig = {
        Puntuazioa: {
            label: "Puntuazioa",
            color: "hsl(var(--chart-2))",
        },
        Akatsak: {
            label: "Akatsak",
            color: "hsl(var(--chart-5))",
        },
    } satisfies React.ComponentProps<typeof ChartContainer>["config"];

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
                    <Button onClick={() => router.push('/ikasleak')} variant="outline" size="sm" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Itzuli
                    </Button>
                    <h1 className="text-3xl font-headline font-bold">Matematika estatistikak</h1>
                    <p className="mt-2 text-muted-foreground">
                        Hemen {studentName}-ren emaitzak ikus ditzakezu.
                    </p>
                </div>
            </div>

            {isGamesLoading && (
                <div className="mt-8 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-2">Emaitzak kargatzen...</p>
                </div>
            )}

            {!isGamesLoading && (
                <div className="mt-8 space-y-8">
                    {/* Kalkulu Mentala Section */}
                    <div>
                        <h2 className="text-2xl font-headline font-bold mb-4">Kalkulu Mentala</h2>
                        {mentalMathGames && mentalMathGames.length > 0 ? (
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Partiden bilakaera</CardTitle>
                                        <CardDescription>Puntuazioa eta akatsak denboran zehar.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                            <RechartsBarChart data={chartData} accessibilityLayer>
                                                <CartesianGrid vertical={false} />
                                                <XAxis
                                                    dataKey="name"
                                                    tickLine={false}
                                                    tickMargin={10}
                                                    axisLine={false}
                                                />
                                                <YAxis />
                                                <ChartTooltip
                                                    cursor={false}
                                                    content={<ChartTooltipContent />}
                                                />
                                                <Bar dataKey="Puntuazioa" fill="var(--color-Puntuazioa)" radius={4} />
                                                <Bar dataKey="Akatsak" fill="var(--color-Akatsak)" radius={4} />
                                            </RechartsBarChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Partiden historiala</CardTitle>
                                        <CardDescription>Jokatutako azken partiden zerrenda.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                        {mentalMathGames.map(game => (
                                            <div key={game.id} className="flex items-center justify-between rounded-md border p-4">
                                                <div>
                                                    <p className="font-semibold">
                                                        {new Date(game.timestamp.seconds * 1000).toLocaleString('eu-ES', { dateStyle: 'medium', timeStyle: 'short' })}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Maila: <span className="font-medium capitalize text-foreground">{game.level}</span>
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-6 text-right">
                                                    <div className="flex items-center gap-2">
                                                        <Trophy className="h-5 w-5 text-yellow-500"/>
                                                        <span className="font-bold text-lg">{game.score}</span>
                                                    </div>
                                                     <div className="flex items-center gap-2">
                                                        <XCircle className="h-5 w-5 text-red-500"/>
                                                        <span className="font-bold text-lg">{game.incorrectAnswers}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Clock className="h-4 w-4"/>
                                                        <span>{game.duration}s</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className="rounded-md border-2 border-dashed border-border p-8 text-center">
                                <BarChart className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">Ez dago "Kalkulu Mentala" daturik</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Ikasle honek ez du oraindik joko honetan jokatu.
                                </p>
                            </div>
                        )}
                    </div>
                    
                    {/* Buruketak Section */}
                    <div>
                        <h2 className="text-2xl font-headline font-bold mb-4">Buruketak</h2>
                        {wordProblemGames && wordProblemGames.length > 0 ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Buruketen historiala</CardTitle>
                                    <CardDescription>Ebatzi dituen azken buruketen zerrenda.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                    {wordProblemGames.map(game => (
                                        <div key={game.id} className="flex flex-col gap-2 rounded-md border p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold">
                                                        {new Date(game.timestamp.seconds * 1000).toLocaleString('eu-ES', { dateStyle: 'medium', timeStyle: 'short' })}
                                                    </p>
                                                    <div className="flex gap-2 text-sm mt-1">
                                                        <Badge variant="secondary" className="capitalize">{game.topic}</Badge>
                                                        <Badge variant="outline" className="capitalize">{game.level}</Badge>
                                                    </div>
                                                </div>
                                                {game.isCorrect ? (
                                                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                                                        <CheckCircle className="h-5 w-5" /> Zuzena
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-red-600 font-semibold">
                                                        <XCircle className="h-5 w-5" /> Okerra
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-2 rounded-md bg-muted/50 p-3 text-sm">
                                                <p className="font-medium mb-1">Galdera:</p>
                                                <p className="text-muted-foreground">{game.problem}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                                                <div>
                                                   <p className="font-medium">Zure erantzuna:</p>
                                                   <p className="font-bold text-lg">{game.userAnswer}</p>
                                                </div>
                                                <div>
                                                   <p className="font-medium">Erantzun zuzena:</p>
                                                   <p className="font-bold text-lg text-primary">{game.correctAnswer}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                             <div className="rounded-md border-2 border-dashed border-border p-8 text-center">
                                <Puzzle className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">Ez dago "Buruketak" daturik</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Ikasle honek ez du oraindik buruketa bat ere ebatzi.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}

    