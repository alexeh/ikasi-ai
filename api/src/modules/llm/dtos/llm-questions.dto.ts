import { QuestionType } from '../../exercises/questions.entity';

export interface LLMQuestionBaseDTO {
  type: QuestionType;
  question: string;
  explanation?: string;
  options: string[];
}

export interface LLMSingleChoiceQuestionDTO extends LLMQuestionBaseDTO {
  type: QuestionType.SINGLE_CHOICE;
  options: string[];
  suggestedCorrectIndex: number; // 0-based
}

export interface LLMOpenAnswerQuestionDTO extends LLMQuestionBaseDTO {
  type: QuestionType.OPEN;
}

export type LLMQuestionDTO =
  | LLMSingleChoiceQuestionDTO
  | LLMOpenAnswerQuestionDTO;

export interface LLMQuestionResponseDTO {
  questions: LLMQuestionDTO[];
}
