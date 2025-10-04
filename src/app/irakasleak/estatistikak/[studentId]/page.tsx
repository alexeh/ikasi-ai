'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/hooks/useUserRole';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function StudentStatsPage({ params }: { params: { studentId: string } }) {
  const router = useRouter();
  const { role, isLoading } = useUserRole();

  if (isLoading) {
    return <div className="container py-8">Loading...</div>;
  }

  if (role !== 'admin') {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to view this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Atzera
      </Button>

      <h1 className="text-3xl font-headline font-bold mb-8">Student Statistics</h1>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Database integration required</AlertTitle>
        <AlertDescription>
          This page requires database integration with Supabase to display student statistics.
          Student ID: {params.studentId}
        </AlertDescription>
      </Alert>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Statistics Overview</CardTitle>
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
