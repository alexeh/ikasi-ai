import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { GeminiProvider } from './providers/gemini.provider';

@Module({
  providers: [LlmService, GeminiProvider],
  exports: [LlmService, GeminiProvider],
})
export class LlmModule {}
