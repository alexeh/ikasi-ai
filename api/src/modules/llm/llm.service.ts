// src/modules/llm/llm.service.ts
import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { FileUploadedToLLM, GeminiProvider } from './providers/gemini.provider';
import { CreateFileParameters } from '@google/genai';
import { Question } from '../exercises/questions.entity';
import { LLMQuestionResponseDTO } from './dtos/llm-questions.dto';

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
  logger: Logger = new Logger(LlmService.name);
  constructor(private readonly gemini: GeminiProvider) {}

  async uploadFileToLLM(file: Express.Multer.File) {
    return this.gemini.uploadFileToLLM({ file });
  }

  async generateQuestionsFromLLMUpload(
    llmFile: FileUploadedToLLM,
  ): Promise<LLMQuestionResponseDTO> {
    try {
      this.logger.log(`Generating questions from LLMUpload`);
      const questions = await this.gemini.generate(llmFile);
      return questions;
    } catch (error) {
      this.logger.error(`Error generating questions by LLM`, error);
      throw new ServiceUnavailableException(
        `Error generating questions from LLMUpload`,
        error,
      );
    }
  }
}
