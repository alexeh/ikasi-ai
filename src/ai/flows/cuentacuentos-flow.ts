'use server';
/**
 * @fileOverview Un agente de IA que inicia una historia para que un niño la continúe.
 *
 * - startSpanishStory - Una función que maneja el proceso de inicio de la historia.
 * - SpanishStoryStarterInput - El tipo de entrada para la función startSpanishStory.
 * - SpanishStoryStarterOutput - El tipo de retorno para la función startSpanishStory.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SpanishStoryStarterInputSchema = z.object({
  topic: z
    .string()
    .describe('El tema sobre el que el niño quiere que trate la historia.'),
});
export type SpanishStoryStarterInput = z.infer<typeof SpanishStoryStarterInputSchema>;

const SpanishStoryStarterOutputSchema = z.object({
  storyStart: z
    .string()
    .describe('El comienzo de la historia, escrito en castellano.'),
});
export type SpanishStoryStarterOutput = z.infer<typeof SpanishStoryStarterOutputSchema>;

export async function startSpanishStory(
  input: SpanishStoryStarterInput
): Promise<SpanishStoryStarterOutput> {
  return cuentacuentosFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cuentacuentosPrompt',
  input: { schema: SpanishStoryStarterInputSchema },
  output: { schema: SpanishStoryStarterOutputSchema },
  prompt: `Eres un cuentacuentos para niños de primaria. Tu tarea es empezar una historia corta y emocionante en castellano sobre el tema proporcionado. Escribe solo los primeros párrafos, dejando claro que la historia no está terminada, para que el niño pueda continuarla. El tema es: {{{topic}}}`,
});

const cuentacuentosFlow = ai.defineFlow(
  {
    name: 'cuentacuentosFlow',
    inputSchema: SpanishStoryStarterInputSchema,
    outputSchema: SpanishStoryStarterOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
