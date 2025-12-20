import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import {
  ChatSession,
  GenerativeModel,
  GoogleGenerativeAI,
} from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { GetAiMessageDTO, ILLMProvider } from '../llm-provider.interface';
import { v4 as uuid } from 'uuid';

export enum GEMINI_MODELS {
  LAST = 'gemini-2.5-flash',
}

@Injectable()
export class GeminiProvider implements ILLMProvider {
  private readonly googleAI: GoogleGenerativeAI;
  private readonly model: GenerativeModel;
  private readonly sessions: { [sessionId: string]: ChatSession } = {};

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new ServiceUnavailableException(
        `GEMINI API KEY MISSING, CAN'T START APP`,
      );
    }
    this.googleAI = new GoogleGenerativeAI(apiKey);
    this.model = this.googleAI.getGenerativeModel({
      model: GEMINI_MODELS.LAST,
    });
  }

  private getChatSession(sessionId: GetAiMessageDTO['sessionId']) {
    const sessionToUSe = sessionId ?? uuid();
    let session = this.sessions[sessionToUSe];
    if (!session) {
      session = this.model.startChat();
      this.sessions[sessionId] = session;
    }
    return {
      sessionId: sessionToUSe,
      chat: session,
    };
  }

  async getAIMessage(dto: GetAiMessageDTO): Promise<string> {
    this.model.generateContent();
  }
}
