import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  ChatSession,
  GenerativeModel,
  GoogleGenerativeAI,
} from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { GetAiMessageDTO } from '../llm-provider.interface';
import { v4 as uuid } from 'uuid';
import {
  CreateFileParameters,
  createPartFromUri,
  createUserContent,
  GoogleGenAI,
} from '@google/genai';
import { Question } from '../../exercises/questions.entity';
import { LLMQuestionResponseDTO } from '../dtos/llm-questions.dto';

export enum GEMINI_MODELS {
  LAST = 'gemini-2.5-flash',
}

export type GenerateQuestionsInput = {
  locale: 'eu' | 'es' | 'en' | string;
  sourceText: string;
  numQuestions?: number; // default 8
};

export type GeneratedQuestion = {
  type: 'single_choice';
  question: string;
  options: { text: string }[];
  suggestedCorrectIndex?: number;
  explanation?: string;
};

type GeminiJsonResponse = {
  questions: Array<{
    type: 'single_choice';
    question: string;
    options: string[];
    suggestedCorrectIndex?: number;
    explanation?: string;
  }>;
};

export type FileUploadedToLLM = CreateFileParameters['file'];

@Injectable()
export class GeminiProvider {
  private readonly googleAI: GoogleGenerativeAI;
  private readonly model: GenerativeModel;
  private readonly ai: GoogleGenAI;
  private readonly sessions: { [sessionId: string]: ChatSession } = {};
  logger: Logger = new Logger(GeminiProvider.name);

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new ServiceUnavailableException(
        `GEMINI API KEY MISSING, CAN'T START APP`,
      );
    }
    this.googleAI = new GoogleGenerativeAI(apiKey);
    this.ai = new GoogleGenAI({ apiKey });
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

  async uploadFileAndGenerateQuestions(params: { file: Express.Multer.File }) {
    const locale = 'eu';
    const numQuestions = 10;
    const { file } = params;
    this.logger.debug(`Uploading file`, file);
    const uploaded = await this.ai.files.upload({
      file: file.path,
      config: { mimeType: file.mimetype },
    });
    this.logger.log('Uploaded file:', uploaded);

    const prompt = this.buildPrompt({ locale, numQuestions });

    const result = await this.ai.models.generateContent({
      model: GEMINI_MODELS.LAST,
      config: {
        candidateCount: 1,
        responseMimeType: 'application/json',
      },
      contents: createUserContent([
        createPartFromUri(uploaded.uri!, uploaded.mimeType!),
        prompt,
      ]),
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const text = (result as any).candidates![0].content!.parts![0]
      .text! as string;
    const parsed = JSON.parse(text);
    return parsed;
  }

  private buildPrompt(params: {
    locale: string;
    numQuestions: number;
  }): string {
    const { locale, numQuestions } = params;

    return [
      `You are an assistant that generates multiple-choice quiz questions from a source document.`,
      ``,
      `Output MUST be valid JSON ONLY (no markdown, no backticks).`,
      `Language: ${locale}.`,
      ``,
      `Constraints:`,
      `- Create exactly ${numQuestions} questions.`,
      `- Each question MUST have exactly 4 answer options.`,
      `- Only one option should be correct.`,
      `- Include suggestedCorrectIndex (0..3) when you are confident.`,
      `- Keep questions grounded in the source text; avoid external facts.`,
      ``,
      `JSON schema:`,
      `{"questions":[{"type":"single_choice","question":"...","options":["...","...","...","..."],"suggestedCorrectIndex":0,"explanation":"..."}]}`,
      ``,
    ].join('\n');
  }

  async uploadFileToLLM(params: { file: Express.Multer.File }) {
    const { file } = params;
    this.logger.debug(`Uploading file to LLM`);
    const uploaded = await this.ai.files.upload({
      file: file.path,
      config: { mimeType: file.mimetype },
    });
    this.logger.log('Uploaded file to LLM');
    return uploaded;
  }

  async generate(uploaded: FileUploadedToLLM) {
    const locale = 'eu';
    const numQuestions = 10;
    const prompt = this.buildPrompt({ locale, numQuestions });

    const result = await this.ai.models.generateContent({
      model: GEMINI_MODELS.LAST,
      config: {
        candidateCount: 1,
        responseMimeType: 'application/json',
      },
      contents: createUserContent([
        createPartFromUri(uploaded.uri!, uploaded.mimeType!),
        prompt,
      ]),
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const text = (result as any).candidates![0].content!.parts![0]
      .text! as string;
    const parsed = JSON.parse(text);
    return parsed as LLMQuestionResponseDTO;
  }
}
