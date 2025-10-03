'use client';

import { useState } from 'react';
import { mockChanges } from '@/lib/mock-data';
import type { Change } from '@/lib/types';
import { ChangeCard } from '@/components/change-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rocket, CheckCircle, XCircle, Hourglass } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SyncDashboard() {
  const [changes, setChanges] = useState<Change[]>(mockChanges);
  const { toast } = useToast();

  const handleStatusChange = (id: string, status: 'approved' | 'rejected') => {
    setChanges((prevChanges) =>
      prevChanges.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  const handleSynchronize = () => {
    const approvedCount = changes.filter((c) => c.status === 'approved').length;
    toast({
      title: 'Synchronization Initiated',
      description: `Approved changes (${approvedCount}) are now being synced.`,
    });
    // Here you would typically call an API to perform the sync.
    // For this demo, we'll just filter out the approved changes after a delay.
    setTimeout(() => {
      setChanges((prev) => prev.filter((c) => c.status !== 'approved'));
      toast({
        title: 'Synchronization Complete!',
        description: 'Data has been successfully synchronized.',
        variant: 'default',
      });
    }, 2000);
  };

  const pendingChanges = changes.filter((c) => c.status === 'pending');
  const approvedChanges = changes.filter((c) => c.status === 'approved');
  const rejectedChanges = changes.filter((c) => c.status === 'rejected');

  const renderChangeList = (changesToRender: Change[]) => {
    if (changesToRender.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center min-h-[400px]">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Hourglass className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No Changes</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            There are no changes in this category.
          </p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        {changesToRender.map((change) => (
          <ChangeCard
            key={change.id}
            change={change}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex-1">
          <h2 className="text-3xl font-headline font-bold">
            Synchronization Hub
          </h2>
          <p className="text-muted-foreground">
            Review, approve, and synchronize data changes.
          </p>
        </div>
        <Button
          onClick={handleSynchronize}
          disabled={approvedChanges.length === 0}
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Rocket className="mr-2 h-4 w-4" />
          Synchronize {approvedChanges.length} Approved
        </Button>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:w-auto sm:grid-cols-3 mb-6">
          <TabsTrigger value="pending">
            <Hourglass className="mr-2 h-4 w-4" />
            Pending ({pendingChanges.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            <CheckCircle className="mr-2 h-4 w-4" />
            Approved ({approvedChanges.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            <XCircle className="mr-2 h-4 w-4" />
            Rejected ({rejectedChanges.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending">{renderChangeList(pendingChanges)}</TabsContent>
        <TabsContent value="approved">
          {renderChangeList(approvedChanges)}
        </TabsContent>
        <TabsContent value="rejected">
          {renderChangeList(rejectedChanges)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
