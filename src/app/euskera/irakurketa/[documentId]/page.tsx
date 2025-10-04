'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

export default function DocumentDetailPage({ params }: { params: Promise<{ documentId: string }> }) {
  const router = useRouter();
  const [documentId, setDocumentId] = React.useState<string>('');

  React.useEffect(() => {
    params.then(p => setDocumentId(p.documentId));
  }, [params]);

  return (
    <div className="container py-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Atzera
      </Button>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Database integration required</AlertTitle>
        <AlertDescription>
          This page requires database integration with Supabase to load and display document content.
          {documentId && ` Document ID: ${documentId}`}
        </AlertDescription>
      </Alert>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Reading Comprehension</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature will be available once database integration with Supabase is complete.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
