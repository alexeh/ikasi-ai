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
  topic: z
    .enum(['deskonposaketa', 'dirua', 'denbora neurriak'])
    .describe('The topic of the math problem.'),
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
Your task is to generate a single math word problem based on the provided difficulty level and topic. The problem should be engaging and appropriate for a 6 to 8-year-old child.
The final answer must be a single number.

Topic: {{{topic}}}
Difficulty Level: {{{level}}}

Here are some examples based on topic and difficulty:
- Topic: deskonposaketa (decomposition)
  - Easy: "Zenbat unitate dira 3 hamarreko eta 4 unitate?" (Answer: 34)
  - Medium: "Deskonposatu 56 zenbakia hamarrekoetan eta unitateetan." (Answer: 50 + 6 or similar, but the final answer should be a number if possible, maybe ask "Zenbat hamarreko ditu 56 zenbakiak?" -> 5) Let's rephrase. "Idatzi 4 hamarreko eta 8 unitatek osatzen duten zenbakia." (Answer: 48)
  - Hard: "125 zenbakian, zenbat balio du 2 zifrak?" (Answer: 20)
- Topic: dirua (money)
  - Easy: "5 euroko billete batekin 2 euroko jostailu bat erosten baduzu, zenbat diru geratzen zaizu?" (Answer: 3)
  - Medium: "3 txanpon dituzu, bata 2 eurokoa, bestea euro 1ekoa eta bestea 50 zentimokoa. Zenbat diru duzu guztira zentimotan?" (Answer: 350)
  - Hard: "10 euro dituzu. 3,50 euroko liburu bat eta 1,20 euroko boligrafo bat erosten dituzu. Zenbat diru geratzen zaizu?" (Answer: 5.30)
- Topic: denbora neurriak (time measures)
  - Easy: "Ordu laurden bat zenbat minutu dira?" (Answer: 15)
  - Medium: "Filme bat 17:00etan hasten da eta 90 minutu irauten du. Zer ordutan amaituko da?" (Answer: 18:30, maybe just ask for the hour: 18) Let's rephrase. "Egun batek 24 ordu ditu. Zenbat ordu dira 3 egun?" (Answer: 72)
  - Hard: "Goizeko 9:30etan etxetik atera naiz eta 10:15etan iritsi naiz eskolara. Zenbat minutu eman ditut bidean?" (Answer: 45)

Generate a new problem now. Ensure the problem strictly adheres to the chosen topic and difficulty.
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
