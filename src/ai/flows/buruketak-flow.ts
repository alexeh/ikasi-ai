'use server';
/**
 * @fileOverview An AI agent that generates math word problems for primary school children.
 *
 * - generateMathProblem - A function that handles the problem generation process.
 * - BuruketakInput - The input type for the function.
 * - BuruketakOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const BuruketakInputSchema = z.object({
  level: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the math problem.'),
});
export type BuruketakInput = z.infer<typeof BuruketakInputSchema>;

const BuruketakOutputSchema = z.object({
  problem: z.string().describe('The math word problem text in Basque (Euskera).'),
  answer: z.number().describe('The correct numerical answer to the problem.'),
});
export type BuruketakOutput = z.infer<typeof BuruketakOutputSchema>;

export async function generateMathProblem(
  input: BuruketakInput
): Promise<BuruketakOutput> {
  return buruketakFlow(input);
}

const prompt = ai.definePrompt({
  name: 'buruketakPrompt',
  input: { schema: BuruketakInputSchema },
  output: { schema: BuruketakOutputSchema },
  prompt: `You are an expert in creating math word problems for primary school children in Basque (Euskera).
Your task is to generate a single math word problem based on the provided difficulty level. The problem should be engaging and appropriate for a 6 to 8-year-old child.
The final answer must be a single number.

Difficulty Level: {{{level}}}

Here are some examples based on difficulty:
- Easy: Simple addition or subtraction with small numbers. (e.g., "Anak 5 goxoki ditu eta 3 gehiago ematen dizkiote. Zenbat goxoki ditu orain?")
- Medium: Addition/subtraction with larger numbers, or simple multiplication. (e.g., "Autobus batean 25 pertsona doaz. Geltoki batean 8 jaitsi eta 5 igo dira. Zenbat pertsona daude orain autobusean?")
- Hard: Multi-step problems involving a mix of operations, including simple division. (e.g., "Maddiok 3 kutxa erosi ditu. Kutxa bakoitzak 10 pegatina ditu. Pegatina guztiak bere 5 lagunen artean banatu nahi ditu. Zenbat pegatina jasoko ditu lagun bakoitzak?")

Generate a new problem now.
`,
});

const buruketakFlow = ai.defineFlow(
  {
    name: 'buruketakFlow',
    inputSchema: BuruketakInputSchema,
    outputSchema: BuruketakOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
