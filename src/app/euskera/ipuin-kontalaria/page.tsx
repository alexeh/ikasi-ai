'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { startStory, type StoryStarterInput } from '@/ai/flows/story-starter-flow';
import { Loader2 } from 'lucide-react';

export default function IpuinKontalariaPage() {
  const [topic, setTopic] = React.useState('');
  const [storyStart, setStoryStart] = React.useState('');
  const [userContinuation, setUserContinuation] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGenerateStory = async () => {
    if (!topic) return;
    setIsLoading(true);
    setStoryStart('');
    try {
      const input: StoryStarterInput = { topic };
      const { storyStart: generatedStart } = await startStory(input);
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
      <h1 className="text-3xl font-headline font-bold">Ipuin Kontalaria</h1>
      <p className="text-muted-foreground mt-2">
        Sortu zure istorioak IA-rekin.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Sortu zure ipuina!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">
              1. Idatzi zure ipuinaren gaia (adibidez, &quot;Herensuge bat
              supermerkatuan&quot;)
            </Label>
            <div className="flex gap-2">
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Adibidez: katu astronauta bat"
                disabled={isLoading}
              />
              <Button onClick={handleGenerateStory} disabled={isLoading || !topic}>
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  'Hasi ipuina'
                )}
              </Button>
            </div>
          </div>

          {storyStart && (
            <div className="space-y-4 rounded-md border bg-muted/50 p-4">
               <div className="space-y-2">
                <p className="font-semibold">2. Irakurri ipuinaren hasiera</p>
                <p className="text-muted-foreground">{storyStart}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="continuation">
                  3. Orain zure txanda! Nola jarraitzen du istorioak?
                </Label>
                <Textarea
                  id="continuation"
                  value={userContinuation}
                  onChange={(e) => setUserContinuation(e.target.value)}
                  placeholder="Idatzi hemen ipuinaren jarraipena..."
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
