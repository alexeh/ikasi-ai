'use client';

import { useState } from 'react';
import { CircleHelp, Loader, ThumbsDown, ThumbsUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

import type { Change } from '@/lib/types';
import type { AnalyzeSyncOperationOutput } from '@/ai/flows/analyze-sync-operation';
import { getSyncAnalysis } from '@/app/actions';

interface ChangeCardProps {
  change: Change;
  onStatusChange: (id: string, status: 'approved' | 'rejected') => void;
}

const getBadgeVariant = (
  type: 'CREATE' | 'UPDATE' | 'DELETE'
): 'default' | 'secondary' | 'destructive' => {
  switch (type) {
    case 'CREATE':
      return 'default';
    case 'UPDATE':
      return 'secondary';
    case 'DELETE':
      return 'destructive';
  }
};

const getStatusBadgeInfo = (
  status: 'pending' | 'approved' | 'rejected'
): { variant: 'secondary' | 'default' | 'destructive'; text: string } => {
  switch (status) {
    case 'pending':
      return { variant: 'secondary', text: 'Pending' };
    case 'approved':
      return { variant: 'default', text: 'Approved' };
    case 'rejected':
      return { variant: 'destructive', text: 'Rejected' };
  }
};

const DataField = ({ field, value }: { field: string; value: any }) => (
  <div className="grid grid-cols-3 gap-2 items-start text-sm">
    <span className="font-medium text-muted-foreground col-span-1">
      {field}:
    </span>
    <pre className="col-span-2 text-right font-mono text-sm bg-transparent p-0 m-0 overflow-x-auto">
      <code>{JSON.stringify(value, null, 2)}</code>
    </pre>
  </div>
);

export function ChangeCard({ change, onStatusChange }: ChangeCardProps) {
  const [analysis, setAnalysis] =
    useState<AnalyzeSyncOperationOutput | null>(change.analysis ?? null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAnalyze = async () => {
    if (analysis) {
      setIsDialogOpen(true);
      return;
    }
    setIsAnalyzing(true);
    setIsDialogOpen(true);
    const operationDetails = `
      Operation Type: ${change.type}
      Entity: ${change.entity} (${change.entityName})
      Timestamp: ${change.timestamp}
      Changes:
      ${
        change.details.old
          ? `OLD_DATA: ${JSON.stringify(change.details.old)}`
          : ''
      }
      ${
        change.details.new
          ? `NEW_DATA: ${JSON.stringify(change.details.new)}`
          : ''
      }
    `;

    const result = await getSyncAnalysis(operationDetails);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const statusInfo = getStatusBadgeInfo(change.status);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <Badge variant={getBadgeVariant(change.type)}>{change.type}</Badge>
              {change.entity}: {change.entityName}
            </CardTitle>
            <CardDescription className="pt-1">
              {new Date(change.timestamp).toLocaleString()}
            </CardDescription>
          </div>
          <Badge variant={statusInfo.variant} className="capitalize">
            {statusInfo.text}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {change.details.old && (
            <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-muted-foreground mb-2">
                Before
              </h4>
              <div className="space-y-2">
                {Object.entries(change.details.old).map(([key, value]) => (
                  <DataField key={key} field={key} value={value} />
                ))}
              </div>
            </div>
          )}
          {change.details.new && (
            <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-muted-foreground mb-2">
                After
              </h4>
              <div className="space-y-2">
                {Object.entries(change.details.new).map(([key, value]) => (
                  <DataField key={key} field={key} value={value} />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 bg-slate-50 dark:bg-slate-900/50 -m-0 mt-auto p-4 border-t">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CircleHelp className="mr-2 h-4 w-4" />
              )}
              Analyze
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle className="font-headline">
                AI-Powered Analysis
              </DialogTitle>
              <DialogDescription>
                Analysis of the "{change.type} {change.entity}" operation.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              {isAnalyzing ? (
                <div className="flex items-center justify-center py-10">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid gap-4 py-4">
                  <div>
                    <h3 className="font-semibold mb-2">Risk Assessment</h3>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md whitespace-pre-wrap">
                      {analysis?.riskAssessment}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Recommendation</h3>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md whitespace-pre-wrap">
                      {analysis?.recommendation}
                    </p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {change.status === 'pending' && (
          <>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onStatusChange(change.id, 'rejected')}
            >
              <ThumbsDown className="h-4 w-4" />
              <span className="sr-only">Reject</span>
            </Button>
            <Button
              size="icon"
              onClick={() => onStatusChange(change.id, 'approved')}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-primary-foreground"
            >
              <ThumbsUp className="h-4 w-4" />
              <span className="sr-only">Approve</span>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
