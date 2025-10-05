'use client';

import * as React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { FileText, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ReadingDocument = {
  id: string;
  title: string;
  language: string;
};

export default function IdatzizkoUlermenaPage() {
  // Placeholder data - will be replaced with Supabase integration
  const documents: ReadingDocument[] = [];

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-headline font-bold">Idatzizko Ulermena</h1>
            <p className="mt-2 text-muted-foreground">
                Aukeratu testu bat irakurtzeko eta galderak erantzuteko.
            </p>
        </div>
      </div>

      <Alert className="mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Database integration required</AlertTitle>
        <AlertDescription>
          This page requires database integration with Supabase to display reading documents.
        </AlertDescription>
      </Alert>

      {documents.length === 0 ? (
        <div className="mt-8 rounded-md border-2 border-dashed border-border p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">
            Ez dago dokumenturik eskuragarri
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Momentu honetan ez dago irakurgaiarik. Laster gehituko dira.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <Link href={`/src/app/(ikasi-ai)/euskera/irakurketa/${doc.id}`} key={doc.id}>
              <Card className="flex h-full transform-gpu flex-col transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <CardTitle>{doc.title}</CardTitle>
                  <CardDescription>
                    Sakatu irakurtzen hasteko
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
