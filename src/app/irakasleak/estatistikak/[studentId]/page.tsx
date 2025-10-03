'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/hooks/useUserRole';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase';
import { collection, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { Loader2, ArrowLeft, BrainCircuit, Puzzle, BarChart, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useMemoFirebase } from '@/firebase';

type MentalMathGame = {
  id: string;
  level: string;
  score: number;
  problemsAttempted: number;
  incorrectAnswers: number;
  duration: number;
  timestamp: Timestamp;
};

type MathWordProblemGame = {
  id: string;
  level: string;
  topic: string;
  problem: string;
  isCorrect: boolean;
  timestamp: Timestamp;
};

const formatEmailToName = (email: string) => {
  if (!email) return '';
  const namePart = email.split('@')[0];
  return namePart.split('.').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
};

export default function StudentStatsPage({ params }: { params: { studentId: string } }) {
  const studentEmail = decodeURIComponent(params.studentId);
  const studentName = formatEmailToName(studentEmail);
  const { role, isLoading: isRoleLoading } = useUserRole();
  const router = useRouter();
  const firestore = useFirestore();

  const mentalMathQuery = useMemoFirebase(
    () =>
      firestore && role === 'admin'
        ? query(
            collection(firestore, 'mentalMathGames'),
            where('studentEmail', '==', studentEmail),
            orderBy('timestamp', 'desc')
          )
        : null,
    [firestore, role, studentEmail]
  );

  const wordProblemsQuery = useMemoFirebase(
    () =>
      firestore && role === 'admin'
        ? query(
            collection(firestore, 'mathWordProblemGames'),
            where('studentEmail', '==', studentEmail),
            orderBy('timestamp', 'desc')
          )
        : null,
    [firestore, role, studentEmail]
  );

  const { data: mentalMathGames, isLoading: isLoadingMentalMath } = useCollection<MentalMathGame>(mentalMathQuery);
  const { data: wordProblemGames, isLoading: isLoadingWordProblems } = useCollection<MathWordProblemGame>(wordProblemsQuery);

  const isLoading = isRoleLoading || isLoadingMentalMath || isLoadingWordProblems;

  if (isRoleLoading) {
    return (
      <div className="container flex h-screen items-center justify-center">
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
  
  return (
    <div className="container py-8">
      <Button onClick={() => router.back()} variant="outline" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Ikasleen zerrendara itzuli
      </Button>
      <h1 className="text-3xl font-headline font-bold">Estatistikak: {studentName}</h1>
      <p className="text-muted-foreground mt-2">{studentEmail}</p>

      {isLoading && (
        <div className="mt-8 flex justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary"/>
        </div>
      )}

      {!isLoading && (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-md">
                      <BrainCircuit className="h-6 w-6 text-primary"/>
                  </div>
                  <div>
                      <CardTitle>Kalkulu Mentala</CardTitle>
                      <CardDescription>Jolastutako partiden emaitzak.</CardDescription>
                  </div>
              </div>
            </CardHeader>
            <CardContent>
              {mentalMathGames && mentalMathGames.length > 0 ? (
                <ul className="space-y-3">
                  {mentalMathGames.map(game => (
                    <li key={game.id} className="flex justify-between items-center rounded-md border p-3">
                      <div>
                        <p className="font-semibold capitalize">{game.level}</p>
                        <p className="text-sm text-muted-foreground">{new Date(game.timestamp.toDate()).toLocaleString()}</p>
                      </div>
                      <p className="text-lg font-bold">Puntuazioa: {game.score}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted-foreground py-4">Ikasle honek ez du oraindik "Kalkulu Mentala" jokoan jokatu.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
               <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-md">
                      <Puzzle className="h-6 w-6 text-primary"/>
                  </div>
                  <div>
                    <CardTitle>Buruketak</CardTitle>
                    <CardDescription>Ebatzi dituen buruketen emaitzak.</CardDescription>
                  </div>
              </div>
            </CardHeader>
            <CardContent>
               {wordProblemGames && wordProblemGames.length > 0 ? (
                <ul className="space-y-3">
                  {wordProblemGames.map(game => (
                    <li key={game.id} className="flex justify-between items-center rounded-md border p-3">
                      <div>
                        <p className="font-semibold capitalize">{game.topic} ({game.level})</p>
                        <p className="text-sm text-muted-foreground">{new Date(game.timestamp.toDate()).toLocaleString()}</p>
                      </div>
                      <span className={`font-bold ${game.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {game.isCorrect ? 'Zuzena' : 'Okerra'}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted-foreground py-4">Ikasle honek ez du oraindik "Buruketak" jokoan jokatu.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
