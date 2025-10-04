'use server';
/**
 * @fileOverview An AI agent that generates reading comprehension questions.
 *
 * - generateComprehensionQuestions - A function that handles the question generation process.
 * - ComprehensionInput - The input type for the function.
 * - ComprehensionOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ComprehensionInputSchema = z.object({
  documentContent: z
    .string()
    .describe('The text of the document to generate questions from.'),
  language: z
    .string()
    .describe(
      'The language of the document (e.g., "euskera" or "gaztelania").'
    ),
});
export type ComprehensionInput = z.infer<typeof ComprehensionInputSchema>;

const QuestionSchema = z.object({
  question: z.string().describe('The question text.'),
  options: z.array(z.string()).describe('A list of possible answers.'),
  correctAnswer: z
    .string()
    .describe('The correct answer from the options.'),
});

const ComprehensionOutputSchema = z.object({
  questions: z
    .array(QuestionSchema)
    .describe('A list of comprehension questions.'),
});
export type ComprehensionOutput = z.infer<typeof ComprehensionOutputSchema>;

export async function generateComprehensionQuestions(
  input: ComprehensionInput
): Promise<ComprehensionOutput> {
  return readingComprehensionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'readingComprehensionPrompt',
  input: { schema: ComprehensionInputSchema },
  output: { schema: ComprehensionOutputSchema },
  prompt: `You are an expert in creating educational content for primary school children. Your task is to generate 5 multiple-choice reading comprehension questions based on the provided text. The questions should be in the specified language.

Language: {{{language}}}
Document Content:
{{{documentContent}}}
`,
});

const readingComprehensionFlow = ai.defineFlow(
  {
    name: 'readingComprehensionFlow',
    inputSchema: ComprehensionInputSchema,
    outputSchema: ComprehensionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
