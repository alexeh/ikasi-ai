// src/modules/llm/llm.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';

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

  async generateQuestions(
    input: GenerateQuestionsInput,
  ): Promise<GeneratedQuestion[]> {
    // Provider router (Gemini first)
    switch (this.provider) {
      case 'gemini':
        return this.generateWithGemini(input);
      case 'openai':
        return this.generateWithOpenAI(input);
      default:
        throw new InternalServerErrorException('LLM_PROVIDER_NOT_SUPPORTED');
    }
  }

  // TODO: implement next
  private async generateWithGemini(
    _input: GenerateQuestionsInput,
  ): Promise<GeneratedQuestion[]> {
    throw new InternalServerErrorException('GEMINI_NOT_IMPLEMENTED');
  }

  // TODO: implement later
  private async generateWithOpenAI(
    _input: GenerateQuestionsInput,
  ): Promise<GeneratedQuestion[]> {
    throw new InternalServerErrorException('OPENAI_NOT_IMPLEMENTED');
  }
}
