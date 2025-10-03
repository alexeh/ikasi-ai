'use server';

import { analyzeSyncOperation } from '@/ai/flows/analyze-sync-operation';

export async function getSyncAnalysis(operationDetails: string) {
  try {
    const analysis = await analyzeSyncOperation({ operationDetails });
    return analysis;
  } catch (error) {
    console.error('Error analyzing sync operation:', error);
    return {
      riskAssessment: 'Could not analyze the operation due to an internal error.',
      recommendation:
        'Proceed with caution. Manual review is highly recommended.',
    };
  }
}
