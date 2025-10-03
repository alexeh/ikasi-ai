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
import { Puzzle, Play, Award, RefreshCw, Loader2, CheckCircle, XCircle } from 'lucide-react';
import {
  generateMathProblem,
  type BuruketakInput,
  type BuruketakOutput,
} from '@/ai/flows/buruketak-flow';

type Level = 'easy' | 'medium' | 'hard';
type GameState = 'selecting' | 'playing' | 'answered';

export default function BuruketakPage() {
  const [selectedLevel, setSelectedLevel] = React.useState<Level | null>(null);
  const [gameState, setGameState] = React.useState<GameState>('selecting');
  const [problemData, setProblemData] = React.useState<BuruketakOutput | null>(null);
  const [userAnswer, setUserAnswer] = React.useState('');
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const answerInputRef = React.useRef<HTMLInputElement>(null);

  const levels = {
    easy: { name: 'Erraza', description: 'Problema sinpleak.' },
    medium: { name: 'Normala', description: 'Zailtasun ertainekoak.' },
    hard: { name: 'Zaila', description: 'Problema konplexuagoak.' },
  };

  React.useEffect(() => {
    if (gameState === 'playing') {
      answerInputRef.current?.focus();
    }
  }, [problemData, gameState]);

  const generateProblem = async (level: Level) => {
    setSelectedLevel(level);
    setGameState('playing');
    setIsLoading(true);
    setProblemData(null);
    setUserAnswer('');
    setIsCorrect(null);
    try {
      const input: BuruketakInput = { level };
      const result = await generateMathProblem(input);
      setProblemData(result);
    } catch (error) {
      console.error('Error generating problem:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetGame = () => {
    setSelectedLevel(null);
    setGameState('selecting');
    setProblemData(null);
    setIsCorrect(null);
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemData || userAnswer === '') return;

    const answerIsCorrect = parseInt(userAnswer, 10) === problemData.answer;
    setIsCorrect(answerIsCorrect);
    setGameState('answered');
  };

  const getNextProblem = () => {
    if (selectedLevel) {
      generateProblem(selectedLevel);
    }
  };

  if (gameState === 'playing' || gameState === 'answered') {
    return (
        <div className="container py-8">
            <Card className="mx-auto w-full max-w-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Maila: {levels[selectedLevel!].name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                     <div className="flex justify-center items-center h-48">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                     </div>
                  ) : problemData && (
                    <div className="space-y-6">
                        <div className="text-lg p-6 rounded-md bg-muted/50 border">
                            <p>{problemData.problem}</p>
                        </div>
                         <form onSubmit={handleAnswerSubmit}>
                            <Label htmlFor="answer" className="text-base">Zure erantzuna:</Label>
                            <div className="flex gap-2 mt-2">
                                <Input
                                    ref={answerInputRef}
                                    id="answer"
                                    type="number"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    placeholder="Idatzi zenbakia..."
                                    className="text-lg h-12"
                                    autoComplete='off'
                                    disabled={gameState === 'answered'}
                                />
                                <Button type="submit" className="h-12" disabled={gameState === 'answered' || !userAnswer}>
                                    Egiaztatu
                                </Button>
                            </div>
                        </form>
                    </div>
                  )}
                  {gameState === 'answered' && isCorrect !== null && (
                    <div className={`mt-6 p-4 rounded-md flex items-center gap-3 ${isCorrect ? 'bg-green-100 border-green-400 text-green-800' : 'bg-red-100 border-red-400 text-red-800'}`}>
                        {isCorrect ? <CheckCircle className="h-6 w-6"/> : <XCircle className="h-6 w-6"/>}
                        <div>
                          <p className="font-bold">{isCorrect ? 'Oso ondo!' : 'Akatsa!'}</p>
                          <p>Erantzun zuzena hau zen: <span className="font-bold">{problemData?.answer}</span></p>
                        </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button onClick={resetGame} variant="outline">
                        Maila aldatu
                    </Button>
                    {gameState === 'answered' && (
                        <Button onClick={getNextProblem}>
                            Hurrengo buruketa
                            <RefreshCw className="ml-2 h-4 w-4"/>
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col items-center text-center">
        <Puzzle className="h-16 w-16 text-primary" />
        <h1 className="mt-4 text-4xl font-headline font-bold">Buruketak</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Aukeratu zailtasun maila bat eta hasi problemak ebazten!
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {(Object.keys(levels) as Level[]).map((level) => (
          <Card
            key={level}
            className="cursor-pointer transition-all hover:border-primary hover:shadow-lg"
            onClick={() => generateProblem(level)}
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
