import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './exercise.entity';
import { InputsService } from '../inputs/inputs.service';
import { LlmService } from '../llm/llm.service';
import { User } from '../users/users.entity';
import { Question } from './questions.entity';
import { Subject, SubjectCode } from '../academics/subjects.entity';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

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

  async findOne(id: string): Promise<Exercise> {
    const result = await this.exercisesRepository.findOne({
      where: { id },
      relations: ['questions', 'questions.subject', 'createdBy'],
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

  createQuestion(question: Question): Question {
    return this.questionRepository.create(question);
  }

  async createFromInput(dto: CreateExerciseFromInputDTO): Promise<Exercise> {
    const { file, subject, user } = dto;
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
        correctAnswerIndex:
          'suggestedCorrectIndex' in question
            ? question.suggestedCorrectIndex
            : undefined,
      });
      questions.push(created);
    });

    const exercise = await this.exercisesRepository.save({
      questions,
      createdBy: user,
    });
    return exercise;
  }

  async update(id: string, dto: UpdateExerciseDto): Promise<Exercise> {
    const exercise = await this.findOne(id);

    // Update exercise properties
    if (dto.title !== undefined) {
      exercise.title = dto.title;
    }
    if (dto.status !== undefined) {
      exercise.status = dto.status;
    }

    // Update questions' correct answer indices
    if (dto.questions && dto.questions.length > 0) {
      for (const questionUpdate of dto.questions) {
        const question = exercise.questions.find(
          (q) => q.id === questionUpdate.id,
        );
        if (question && questionUpdate.correctAnswerIndex !== undefined) {
          question.correctAnswerIndex = questionUpdate.correctAnswerIndex;
          await this.questionRepository.save(question);
        }
      }
    }

    return this.exercisesRepository.save(exercise);
  }
}
