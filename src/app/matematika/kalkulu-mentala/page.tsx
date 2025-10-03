'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BrainCircuit, Play, Timer, Award } from 'lucide-react';

type Level = 'easy' | 'medium' | 'hard';

export default function KalkuluMentalaPage() {
  const [selectedLevel, setSelectedLevel] = React.useState<Level | null>(null);

  const levels = {
    easy: { name: 'Erraza', description: 'Batuketak eta kenketak.' },
    medium: { name: 'Normala', description: 'Biderketekin nahastuta.' },
    hard: { name: 'Zaila', description: 'Eragiketa konplexuagoak.' },
  };

  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level);
    // Game logic will go here in the next step
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col items-center text-center">
        <BrainCircuit className="h-16 w-16 text-primary" />
        <h1 className="mt-4 text-4xl font-headline font-bold">Kalkulu Mentala</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Aukeratu zailtasun maila bat eta hasi jolasten!
        </p>
      </div>

      {!selectedLevel ? (
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {(Object.keys(levels) as Level[]).map((level) => (
            <Card
              key={level}
              className="cursor-pointer transition-all hover:border-primary hover:shadow-lg"
              onClick={() => handleLevelSelect(level)}
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
      ) : (
        <Card className="mx-auto mt-12 w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              Jolasa prest: {levels[selectedLevel].name}
            </CardTitle>
            <CardDescription>
              Jokoaren logika hurrengo urratsean inplementatuko da.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4 text-muted-foreground">
              Hemen agertuko dira galderak eta tenporizadorea.
            </p>
            <Button onClick={() => setSelectedLevel(null)} variant="outline">
              Atzera
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
