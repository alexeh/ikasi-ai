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
import { Puzzle, Play, Award, RefreshCw, Loader2, CheckCircle, XCircle, ArrowLeft, Scale, Banknote, Clock } from 'lucide-react';
import {
  generateMathProblem,
  type BuruketakInput,
  type BuruketakOutput,
} from '@/ai/flows/buruketak-flow';
import { useUserRole } from '@/hooks/useUserRole';

type Topic = 'deskonposaketa' | 'dirua' | 'denbora neurriak';
type Level = 'easy' | 'medium' | 'hard';
type GameState = 'selecting_topic' | 'selecting_level' | 'playing' | 'answered';

export default function BuruketakPage() {
  const [selectedTopic, setSelectedTopic] = React.useState<Topic | null>(null);
  const [selectedLevel, setSelectedLevel] = React.useState<Level | null>(null);
  const [gameState, setGameState] = React.useState<GameState>('selecting_topic');
  const [problemData, setProblemData] = React.useState<BuruketakOutput | null>(null);
  const [userAnswer, setUserAnswer] = React.useState('');
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const answerInputRef = React.useRef<HTMLInputElement>(null);

  const { email } = useUserRole();


  const topics = {
    deskonposaketa: { name: 'Deskonposaketa', description: 'Zenbakiak landu.', icon: <Scale/> },
    dirua: { name: 'Dirua', description: 'Euroekin eragiketak.', icon: <Banknote/> },
    'denbora neurriak': { name: 'Denbora Neurriak', description: 'Orduak eta minutuak.', icon: <Clock/> },
  };

  const levels = {
    easy: { name: 'Erraza', description: 'Problema sinpleak.' },
    medium: { name: 'Normala', description: 'Zailtasun ertainekoak.' },
    hard: { name: 'Zaila', description: 'Problema konplexuagoak.' },
  };

  React.useEffect(() => {
    if (gameState === 'playing' && !isLoading) {
      answerInputRef.current?.focus();
    }
  }, [problemData, gameState, isLoading]);

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setGameState('selecting_level');
  }

  const generateProblem = async (level: Level) => {
    if (!selectedTopic) return;
    setSelectedLevel(level);
    setGameState('playing');
    setIsLoading(true);
    setProblemData(null);
    setUserAnswer('');
    setIsCorrect(null);
    try {
      const input: BuruketakInput = { level, topic: selectedTopic };
      const result = await generateMathProblem(input);
      setProblemData(result);
    } catch (error) {
      console.error('Error generating problem:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetGame = () => {
    setSelectedTopic(null);
    setSelectedLevel(null);
    setGameState('selecting_topic');
    setProblemData(null);
    setIsCorrect(null);
  };
  
  const backToLevelSelection = () => {
    setGameState('selecting_level');
    setProblemData(null);
    setIsCorrect(null);
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemData || userAnswer === '' || !selectedLevel || !selectedTopic) return;

    const parsedUserAnswer = parseInt(userAnswer, 10);
    const answerIsCorrect = parsedUserAnswer === problemData.answer;
    setIsCorrect(answerIsCorrect);
    setGameState('answered');

    // Note: Game results are not saved to database yet.
    // This will be implemented with Supabase integration.
    console.log('Game result:', {
      level: selectedLevel,
      topic: selectedTopic,
      problem: problemData.problem,
      correctAnswer: problemData.answer,
      userAnswer: parsedUserAnswer,
      isCorrect: answerIsCorrect,
      studentEmail: email,
    });
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
                  <CardTitle className="text-2xl">Gaia: {topics[selectedTopic!].name} - Maila: {levels[selectedLevel!].name}</CardTitle>
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
                    <Button onClick={backToLevelSelection} variant="outline">
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

  if (gameState === 'selecting_level' && selectedTopic) {
    return (
        <div className="container py-8">
            <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-4">
                     <Button onClick={() => setGameState('selecting_topic')} variant="ghost" size="icon" className="mb-4">
                        <ArrowLeft className="h-6 w-6"/>
                    </Button>
                    <div className="text-left">
                        <h1 className="mt-4 text-4xl font-headline font-bold">{topics[selectedTopic].name}</h1>
                        <p className="mt-2 text-lg text-muted-foreground">
                            Aukeratu zailtasun maila bat hasteko.
                        </p>
                    </div>
                </div>
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
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col items-center text-center">
        <Puzzle className="h-16 w-16 text-primary" />
        <h1 className="mt-4 text-4xl font-headline font-bold">Buruketak</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Aukeratu gai bat eta hasi problemak ebazten!
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {(Object.keys(topics) as Topic[]).map((topic) => (
          <Card
            key={topic}
            className="cursor-pointer transition-all hover:border-primary hover:shadow-lg flex flex-col"
            onClick={() => handleTopicSelect(topic)}
          >
            <CardHeader className="flex-1">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-md">
                        {topics[topic].icon}
                    </div>
                    <div>
                        <CardTitle>{topics[topic].name}</CardTitle>
                        <CardDescription>{topics[topic].description}</CardDescription>
                    </div>
                </div>
            </CardHeader>
             <CardFooter>
                <Button className="w-full" variant="secondary">
                    Aukeratu
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
