'use client';

import * as React from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { FileText, Loader2, PlusCircle, BarChart } from 'lucide-react';
import { useMemoFirebase } from '@/firebase';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';

type ReadingDocument = {
  id: string;
  title: string;
  language: string;
};

export default function IdatzizkoUlermenaPage() {
  const firestore = useFirestore();
  const { role, isLoading: isRoleLoading } = useUserRole();

  const documentsQuery = useMemoFirebase(
    () =>
      firestore && role === 'student'
        ? query(
            collection(firestore, 'readingDocuments'),
            where('language', '==', 'euskera')
          )
        : null,
    [firestore, role]
  );

  const { data: documents, isLoading: isDocumentsLoading } = useCollection<ReadingDocument>(documentsQuery);

  const isLoading = isRoleLoading || isDocumentsLoading;

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-headline font-bold">Idatzizko Ulermena</h1>
            <p className="mt-2 text-muted-foreground">
                {role === 'admin' 
                    ? 'Kudeatu irakurgaiak.'
                    : 'Aukeratu testu bat irakurtzeko eta galderak erantzuteko.'
                }
            </p>
        </div>
      </div>


      {isLoading && (
        <div className="mt-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Kargatzen...</p>
        </div>
      )}
      
      {!isLoading && role === 'admin' && (
         <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Irakaslearen panela</CardTitle>
                    <CardDescription>Hemen irakurgai berriak gehitu ditzakezu ikasleentzat.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/irakasleak/gehitu">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Gehitu dokumentu berria
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      )}

      {!isLoading && role === 'student' && (
        <>
            {documents?.length === 0 && (
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
        </>
      )}
    </div>
  );
}
