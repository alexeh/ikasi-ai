'use server';

/**
 * @fileOverview An AI agent for analyzing synchronization operations.
 *
 * - analyzeSyncOperation - A function that analyzes a synchronization operation and provides a risk assessment.
 * - AnalyzeSyncOperationInput - The input type for the analyzeSyncOperation function.
 * - AnalyzeSyncOperationOutput - The return type for the analyzeSyncOperation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSyncOperationInputSchema = z.object({
  operationDetails: z
    .string()
    .describe('Details of the synchronization operation, including the source, destination, and changes involved.'),
});
export type AnalyzeSyncOperationInput = z.infer<typeof AnalyzeSyncOperationInputSchema>;

const AnalyzeSyncOperationOutputSchema = z.object({
  riskAssessment: z
    .string()
    .describe('An assessment of the potential risks associated with the synchronization operation.'),
  recommendation: z
    .string()
    .describe('A recommendation on whether to proceed with the synchronization operation, and any precautions to take.'),
});
export type AnalyzeSyncOperationOutput = z.infer<typeof AnalyzeSyncOperationOutputSchema>;

export async function analyzeSyncOperation(
  input: AnalyzeSyncOperationInput
): Promise<AnalyzeSyncOperationOutput> {
  return analyzeSyncOperationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSyncOperationPrompt',
  input: {schema: AnalyzeSyncOperationInputSchema},
  output: {schema: AnalyzeSyncOperationOutputSchema},
  prompt: `You are an AI assistant specializing in data synchronization risk assessment.

You will analyze the provided synchronization operation details and provide a risk assessment and recommendation.

Synchronization Operation Details: {{{operationDetails}}}

Respond with a detailed risk assessment and a clear recommendation. Consider possible data corruption, conflicts, and unintended consequences in your assessment.`,
});

const analyzeSyncOperationFlow = ai.defineFlow(
  {
    name: 'analyzeSyncOperationFlow',
    inputSchema: AnalyzeSyncOperationInputSchema,
    outputSchema: AnalyzeSyncOperationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
