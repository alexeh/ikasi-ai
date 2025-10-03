import type { AnalyzeSyncOperationOutput } from '@/ai/flows/analyze-sync-operation';

export type Change = {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: string;
  entityName: string;
  timestamp: string;
  details: {
    old?: Record<string, any>;
    new?: Record<string, any>;
  };
  status: 'pending' | 'approved' | 'rejected';
  analysis?: AnalyzeSyncOperationOutput;
  isAnalyzing?: boolean;
};
