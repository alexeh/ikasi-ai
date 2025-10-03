'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrainCircuit, Play, Timer, Award, RefreshCw } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useUserRole } from '@/hooks/useUserRole';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

type Level = 'easy' | 'medium' | 'hard';
type GameState = 'selecting' | 'playing' | 'finished';

interface Problem {
  text: string;
  answer: number;
}

// --- Problem Generation Logic ---
const generateProblem = (level: Level): Problem => {
  let num1: number, num2: number, operator: string;

  switch (level) {
    case 'easy': // Simple addition and subtraction
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      if (Math.random() > 0.5) {
        operator = '+';
        return { text: `${num1} + ${num2}`, answer: num1 + num2 };
      } else {
        // Ensure result isn't negative
        if (num1 < num2) [num1, num2] = [num2, num1];
        operator = '-';
        return { text: `${num1} - ${num2}`, answer: num1 - num2 };
      }

    case 'medium': // Adds multiplication
      if (Math.random() < 0.33) {
        num1 = Math.floor(Math.random() * 9) + 2; // 2-10
        num2 = Math.floor(Math.random() * 9) + 2; // 2-10
        operator = '×';
        return { text: `${num1} ${operator} ${num2}`, answer: num1 * num2 };
      } else {
        // reuse easy logic
        return generateProblem('easy');
      }

    case 'hard': // 3-digit add/sub, all mult, simple division
      const type = Math.random();
      if (type < 0.25) { // Division
        num2 = Math.floor(Math.random() * 9) + 2; // Divisor 2-10
        const result = Math.floor(Math.random() * 9) + 2;
        num1 = num2 * result;
        operator = '÷';
        return { text: `${num1} ${operator} ${num2}`, answer: result };
      } else if (type < 0.5) { // Multiplication
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        operator = '×';
        return { text: `${num1} ${operator} ${num2}`, answer: num1 * num2 };
      } else { // 3-digit add/sub
        num1 = Math.floor(Math.random() * 900) + 100;
        num2 = Math.floor(Math.random() * 900) + 100;
        if (Math.random() > 0.5) {
            operator = '+';
            return { text: `${num1} + ${num2}`, answer: num1 + num2 };
        } else {
            if (num1 < num2) [num1, num2] = [num2, num1];
            operator = '-';
            return { text: `${num1} - ${num2}`, answer: num1 - num2 };
        }
      }
  }
};


export default function KalkuluMentalaPage() {
  const [selectedLevel, setSelectedLevel] = React.useState<Level | null>(null);
  const [gameState, setGameState] = React.useState<GameState>('selecting');
  const [problem, setProblem] = React.useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = React.useState('');
  const [score, setScore] = React.useState(0);
  const [problemsAttempted, setProblemsAttempted] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(60);
  const answerInputRef = React.useRef<HTMLInputElement>(null);

  const firestore = useFirestore();
  const { user } = useUser();
  const { email } = useUserRole();

  const endGame = React.useCallback(() => {
    setGameState('finished');
    if (user && selectedLevel && firestore && problemsAttempted > 0) {
      const collectionRef = collection(firestore, 'mentalMathGames');
      const gameData = {
        studentId: user.uid,
        studentEmail: email,
        level: selectedLevel,
        score: score,
        problemsAttempted: problemsAttempted,
        incorrectAnswers: problemsAttempted - score,
        duration: 60,
        timestamp: serverTimestamp(),
      };

      addDoc(collectionRef, gameData).catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: collectionRef.path,
          operation: 'create',
          requestResourceData: gameData,
        });
        errorEmitter.emit('permission-error', permissionError);
        console.error('Error saving game result:', serverError);
      });
    }
  }, [user, selectedLevel, firestore, problemsAttempted, score, email]);


  const levels = {
    easy: { name: 'Erraza', description: 'Batuketak eta kenketak.' },
    medium: { name: 'Normala', description: 'Biderketekin nahastuta.' },
    hard: { name: 'Zaila', description: 'Eragiketa konplexuagoak.' },
  };

  React.useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
  }, [gameState, timeLeft, endGame]);
  
  React.useEffect(() => {
    if (gameState === 'playing') {
      answerInputRef.current?.focus();
    }
  }, [problem, gameState]);

  const startGame = (level: Level) => {
    setSelectedLevel(level);
    setGameState('playing');
    setScore(0);
    setProblemsAttempted(0);
    setTimeLeft(60);
    setProblem(generateProblem(level));
    setUserAnswer('');
  };

  const resetGame = () => {
    setSelectedLevel(null);
    setGameState('selecting');
    setScore(0);
    setProblemsAttempted(0);
    setTimeLeft(60);
    setProblem(null);
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem || userAnswer === '') return;

    setProblemsAttempted((p) => p + 1);
    if (parseInt(userAnswer, 10) === problem.answer) {
      setScore((s) => s + 1);
    }

    if (selectedLevel) {
        setProblem(generateProblem(selectedLevel));
    }
    setUserAnswer('');
  };

  // --- Render logic based on gameState ---

  if (gameState === 'finished') {
    return (
         <div className="container flex flex-col items-center justify-center py-8 text-center">
            <Award className="h-16 w-16 text-yellow-500" />
            <h1 className="mt-4 text-4xl font-headline font-bold">Jolasa amaitu da!</h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Zure azken puntuazioa:
            </p>
            <p className="my-4 text-6xl font-bold text-primary">{score}</p>
            <div className="flex gap-4">
                <Button onClick={resetGame}>
                    <Play className="mr-2" />
                    Jolastu berriro
                </Button>
                 <Button onClick={() => startGame(selectedLevel!)} variant="outline">
                    <RefreshCw className="mr-2" />
                    Berrabiarazi maila
                </Button>
            </div>
      </div>
    );
  }

  if (gameState === 'playing' && selectedLevel) {
    return (
        <div className="container py-8">
            <Card className="mx-auto w-full max-w-2xl">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl">Maila: {levels[selectedLevel].name}</CardTitle>
                        <div className="flex items-center gap-2 font-bold text-primary">
                            <Timer />
                            <span>{timeLeft}s</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="text-center">
                    <div className="my-8">
                        <p className="text-6xl font-bold tracking-widest text-foreground">
                            {problem?.text}
                        </p>
                    </div>
                    <form onSubmit={handleAnswerSubmit}>
                        <Label htmlFor="answer" className="sr-only">Erantzuna</Label>
                        <Input
                            ref={answerInputRef}
                            id="answer"
                            type="number"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Zure erantzuna..."
                            className="text-center text-2xl h-14"
                            autoComplete='off'
                        />
                         <Button type="submit" className="w-full mt-4">
                            Egiaztatu
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <p className="font-bold">Puntuazioa: {score}</p>
                    <Button onClick={resetGame} variant="outline">
                        Irten
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col items-center text-center">
        <BrainCircuit className="h-16 w-16 text-primary" />
        <h1 className="mt-4 text-4xl font-headline font-bold">Kalkulu Mentala</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Aukeratu zailtasun maila bat eta hasi jolasten!
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {(Object.keys(levels) as Level[]).map((level) => (
          <Card
            key={level}
            className="cursor-pointer transition-all hover:border-primary hover:shadow-lg"
            onClick={() => startGame(level)}
          >
            <CardHeader>
              <CardTitle>{levels[level].name}</CardTitle>
              <CardDescription>{levels[level].description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Play className="mr-2" />
                Hasi
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
