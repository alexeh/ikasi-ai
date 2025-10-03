'use client';

import * as React from 'react';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import {
  generateComprehensionQuestions,
  type ComprehensionInput,
  type ComprehensionOutput,
} from '@/ai/flows/reading-comprehension-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useMemoFirebase } from '@/firebase';

type ReadingDocument = {
  id: string;
  title: string;
  content: string;
  language: 'euskera' | 'gaztelania';
};

type QuestionState = ComprehensionOutput['questions'][0] & {
  selectedAnswer?: string;
  isCorrect?: boolean;
};

export default function DocumentDetailPage({
  params,
}: {
  params: { documentId: string };
}) {
  const firestore = useFirestore();
  const docRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'readingDocuments', params.documentId) : null),
    [firestore, params.documentId]
  );
  const { data: document, isLoading: isDocumentLoading } = useDoc<ReadingDocument>(docRef);

  const [questions, setQuestions] = React.useState<QuestionState[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [score, setScore] = React.useState<number | null>(null);

  const handleGenerateQuestions = async () => {
    if (!document) return;
    setIsLoadingQuestions(true);
    setQuestions([]);
    setScore(null);
    try {
      const input: ComprehensionInput = {
        documentContent: document.content,
        language: document.language,
      };
      const { questions: generatedQuestions } = await generateComprehensionQuestions(input);
      setQuestions(generatedQuestions);
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setIsLoadingQuestions(false);
    }
  };
  
  const handleAnswerChange = (questionIndex: number, selectedAnswer: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].selectedAnswer = selectedAnswer;
    setQuestions(newQuestions);
  };
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    let correctCount = 0;
    const newQuestions = questions.map(q => {
      const isCorrect = q.selectedAnswer === q.correctAnswer;
      if (isCorrect) {
        correctCount++;
      }
      return { ...q, isCorrect };
    });
    setQuestions(newQuestions);
    setScore(correctCount);
    setIsSubmitting(false);
  };

  const getCardBorderColor = (isCorrect?: boolean) => {
    if (isCorrect === undefined) return '';
    return isCorrect ? 'border-green-500' : 'border-red-500';
  }

  if (isDocumentLoading) {
    return (
      <div className="container flex h-full items-center justify-center py-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold">Dokumentua ez da aurkitu</h1>
        <p className="text-muted-foreground">Ezin izan da eskatutako dokumentua aurkitu.</p>
        <Button asChild className="mt-4">
          <a href="/euskera/irakurketa">Itzuli zerrendara</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">{document.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none rounded-md bg-muted/50 p-4">
            <p className="whitespace-pre-wrap">{document.content}</p>
          </div>
        </CardContent>
        <CardFooter>
          {questions.length === 0 && (
            <Button onClick={handleGenerateQuestions} disabled={isLoadingQuestions}>
              {isLoadingQuestions ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Galderak sortzen...
                </>
              ) : (
                'Ulermen galderak sortu'
              )}
            </Button>
          )}
        </CardFooter>
      </Card>

      {questions.length > 0 && (
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-headline font-bold">Galderak</h2>
          {questions.map((q, index) => (
            <Card key={index} className={`transition-colors ${getCardBorderColor(q.isCorrect)}`}>
              <CardHeader>
                <CardTitle>
                  {index + 1}. {q.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={q.selectedAnswer}
                  onValueChange={(value) => handleAnswerChange(index, value)}
                  disabled={isSubmitting || score !== null}
                >
                  {q.options.map((option, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`q${index}-o${i}`} />
                      <Label htmlFor={`q${index}-o${i}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
          <div className="flex items-center justify-between">
             <Button onClick={handleSubmit} disabled={isSubmitting || score !== null}>
               Erantzunak egiaztatu
             </Button>
            {score !== null && (
              <div className="text-right font-bold">
                <p>
                  Puntuazioa: {score} / {questions.length}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
