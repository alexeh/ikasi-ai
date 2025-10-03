'use server';
/**
 * @fileOverview Un agente de IA que inicia una historia para que un niño la continúe.
 *
 * - startStory - Una función que maneja el proceso de inicio de la historia.
 * - StoryStarterInput - El tipo de entrada para la función startStory.
 * - StoryStarterOutput - El tipo de retorno para la función startStory.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const StoryStarterInputSchema = z.object({
  topic: z
    .string()
    .describe('El tema sobre el que el niño quiere que trate la historia.'),
});
export type StoryStarterInput = z.infer<typeof StoryStarterInputSchema>;

const StoryStarterOutputSchema = z.object({
  storyStart: z
    .string()
    .describe('El comienzo de la historia, escrito en Euskera.'),
});
export type StoryStarterOutput = z.infer<typeof StoryStarterOutputSchema>;

export async function startStory(
  input: StoryStarterInput
): Promise<StoryStarterOutput> {
  return storyStarterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'storyStarterPrompt',
  input: { schema: StoryStarterInputSchema },
  output: { schema: StoryStarterOutputSchema },
  prompt: `Eres un cuentacuentos para niños de primaria. Tu tarea es empezar una historia corta y emocionante en Euskera sobre el tema proporcionado. Escribe solo los primeros párrafos, dejando claro que la historia no está terminada, para que el niño pueda continuarla. El tema es: {{{topic}}}`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
       {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
       {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
       {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ],
  }
});

const storyStarterFlow = ai.defineFlow(
  {
    name: 'storyStarterFlow',
    inputSchema: StoryStarterInputSchema,
    outputSchema: StoryStarterOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
