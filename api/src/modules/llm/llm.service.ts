// src/modules/llm/llm.service.ts
import { Injectable } from '@nestjs/common';
import { FileUploadedToLLM, GeminiProvider } from './providers/gemini.provider';
import { CreateFileParameters } from '@google/genai';

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
  constructor(private readonly gemini: GeminiProvider) {}

  async uploadFileToLLM(file: Express.Multer.File) {
    return this.gemini.uploadFileToLLM({ file });
  }

  async generateExerciseFromLLMUpload(
    llmFile: FileUploadedToLLM,
  ): Promise<any> {
    return this.gemini.generate(llmFile);
  }
}
