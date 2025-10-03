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

export default function ComprensionLectoraPage() {
  const firestore = useFirestore();
  const { role, isLoading: isRoleLoading } = useUserRole();

  const documentsQuery = useMemoFirebase(
    () =>
      firestore && role === 'student'
        ? query(
            collection(firestore, 'readingDocuments'),
            where('language', '==', 'gaztelania')
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
                <h1 className="text-3xl font-headline font-bold">Comprensión Lectora</h1>
                <p className="mt-2 text-muted-foreground">
                    {role === 'admin'
                        ? 'Gestiona las lecturas o consulta las estadísticas.'
                        : 'Elige un texto para leer y responder a las preguntas.'
                    }
                </p>
            </div>
            <Button variant="outline">
                <BarChart className="mr-2 h-4 w-4" />
                Estadísticas
            </Button>
        </div>

       {isLoading && (
        <div className="mt-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Cargando...</p>
        </div>
      )}

      {!isLoading && role === 'admin' && (
         <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Panel del profesor</CardTitle>
                    <CardDescription>Aquí puedes añadir nuevas lecturas para los alumnos.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/irakasleak/gehitu">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Añadir nuevo documento
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
                    No hay documentos disponibles
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    En este momento no hay lecturas. Se añadirán próximamente.
                </p>
                </div>
            )}

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {documents?.map((doc) => (
                <Link href={`/gaztelania/lectura/${doc.id}`} key={doc.id}>
                    <Card className="flex h-full transform-gpu flex-col transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
                    <CardHeader>
                        <CardTitle>{doc.title}</CardTitle>
                        <CardDescription>
                        Pulsa para empezar a leer
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
