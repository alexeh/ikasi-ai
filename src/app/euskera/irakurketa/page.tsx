'use client';

import * as React from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { FileText, Loader2 } from 'lucide-react';
import { useMemoFirebase } from '@/firebase';

type ReadingDocument = {
  id: string;
  title: string;
  language: string;
};

export default function IdatzizkoUlermenaPage() {
  const firestore = useFirestore();

  const documentsQuery = useMemoFirebase(
    () =>
      firestore
        ? query(
            collection(firestore, 'readingDocuments'),
            where('language', '==', 'euskera')
          )
        : null,
    [firestore]
  );

  const { data: documents, isLoading } = useCollection<ReadingDocument>(documentsQuery);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-headline font-bold">Idatzizko Ulermena</h1>
      <p className="mt-2 text-muted-foreground">
        Aukeratu testu bat irakurtzeko eta galderak erantzuteko.
      </p>

      {isLoading && (
        <div className="mt-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Testuak kargatzen...</p>
        </div>
      )}

      {!isLoading && documents?.length === 0 && (
        <div className="mt-8 rounded-md border-2 border-dashed border-border p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">
            Ez dago dokumenturik eskuragarri
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Momentu honetan ez dago irakurgaiarik. Laster gehituko dira.
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents?.map((doc) => (
          <Link href={`/euskera/irakurketa/${doc.id}`} key={doc.id}>
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
    </div>
  );
}
