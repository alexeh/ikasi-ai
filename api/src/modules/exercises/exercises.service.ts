import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './exercise.entity';
import { InputsService } from '../inputs/inputs.service';
import { LlmService } from '../llm/llm.service';
import { User } from '../users/users.entity';
import { Question, QuestionType } from './questions.entity';
import { Subject, SubjectCode } from '../academics/subjects.entity';

export interface CreateExerciseFromInputDTO {
  file: Express.Multer.File;
  subject: SubjectCode;
  category: string;
  user: User;
}

@Injectable()
export class ExercisesService {
  logger = new Logger(ExercisesService.name);
  constructor(
    @InjectRepository(Exercise)
    private exercisesRepository: Repository<Exercise>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    private readonly input: InputsService,
    private readonly llm: LlmService,
  ) {}

  async findAll(): Promise<Exercise[]> {
    return this.exercisesRepository.find();
  }

  async findOne(id: string): Promise<Exercise | undefined> {
    const result = await this.exercisesRepository.findOneBy({
      id,
    });
    if (!result) {
      throw new NotFoundException(`Exercises with id: ${id} not found`);
    }
    return result;
  }

  // async createExcercise(
  //   exercise: Partial<Exercise>,
  //   subject: SubjectCode,
  // ): Promise<Exercise> {
  //   const questions: Question[] = [];
  //
  //   const newExercise = this.exercisesRepository.create(exercise);
  //   return this.exercisesRepository.save(newExercise);
  // }

  async createQuestion(question: Question): Promise<Question> {
    return this.questionRepository.create(question);
  }

  async createFromInput(dto: CreateExerciseFromInputDTO): Promise<any> {
    const { file, subject, user, category } = dto;
    const savedInput = await this.input.create(file);
    this.logger.log(`Generating questions....`);
    const llmGeneratedQuestions = await this.llm.generateQuestionsFromLLMUpload(
      savedInput.llmUploadData,
    );
    this.logger.log(`Questions generated`);
    const questions: Question[] = [];
    llmGeneratedQuestions.questions.forEach((question) => {
      const created = this.questionRepository.create({
        prompt: question.question,
        explanation: question.explanation,
        options: question.options,
        subject: { id: subject } as Subject,
        type: question.type,
      });
      questions.push(created);
    });

    const exercise = await this.exercisesRepository.save({
      questions,
      createdBy: user,
    });
    return exercise;
  }
}
