'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { startSpanishStory, type SpanishStoryStarterInput } from '@/ai/flows/cuentacuentos-flow';
import { Loader2 } from 'lucide-react';

export default function CuentacuentosPage() {
  const [topic, setTopic] = React.useState('');
  const [storyStart, setStoryStart] = React.useState('');
  const [userContinuation, setUserContinuation] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGenerateStory = async () => {
    if (!topic) return;
    setIsLoading(true);
    setStoryStart('');
    try {
      const input: SpanishStoryStarterInput = { topic };
      const { storyStart: generatedStart } = await startSpanishStory(input);
      setStoryStart(generatedStart);
    } catch (error) {
      console.error('Error generating story:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-headline font-bold">El Cuentacuentos</h1>
      <p className="text-muted-foreground mt-2">
        Crea tus propias historias con IA.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>¡Crea tu propio cuento!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">
              1. Escribe el tema de tu cuento (p. ej., &quot;Un dragón en el supermercado&quot;)
            </Label>
            <div className="flex gap-2">
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ej: un gato astronauta"
                disabled={isLoading}
              />
              <Button onClick={handleGenerateStory} disabled={isLoading || !topic}>
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  'Empezar cuento'
                )}
              </Button>
            </div>
          </div>

          {storyStart && (
            <div className="space-y-4 rounded-md border bg-muted/50 p-4">
               <div className="space-y-2">
                <p className="font-semibold">2. Lee el principio del cuento</p>
                <p className="text-muted-foreground">{storyStart}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="continuation">
                  3. ¡Ahora te toca a ti! ¿Cómo sigue la historia?
                </Label>
                <Textarea
                  id="continuation"
                  value={userContinuation}
                  onChange={(e) => setUserContinuation(e.target.value)}
                  placeholder="Escribe aquí la continuación del cuento..."
                  rows={8}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
