export class GetAiMessageDTO {
  prompt: string;
  sessionId: string;
}

export interface ILLMProvider {
  getAIMessage(dto: GetAiMessageDTO): Promise<string>;
}
