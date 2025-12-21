// src/modules/llm/llm.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GeminiProvider } from './providers/gemini.provider';

export type LlmProvider = 'gemini' | 'openai';

export type GenerateQuestionsInput = {
  locale: string; // 'eu' | 'es' | 'en'
  sourceText: string;
  numQuestions?: number;
};

export type GeneratedOption = {
  text: string;
};

export type GeneratedQuestion = {
  type: 'single_choice';
  question: string;
  options: GeneratedOption[];
  suggestedCorrectIndex?: number; // optional hint
};

@Injectable()
export class LlmService {
  private provider: LlmProvider =
    (process.env.LLM_PROVIDER as LlmProvider) || 'gemini';

  constructor(private readonly gemini: GeminiProvider) {}

  async generateFromFile(file: Express.Multer.File): Promise<any> {
    return this.gemini.uploadFileAndGenerateQuestions({ file });
  }
}
