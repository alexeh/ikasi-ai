import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './exercise.entity';
import { InputsService } from '../inputs/inputs.service';
import { LlmService } from '../llm/llm.service';
import { User } from '../users/users.entity';

export interface CreateExerciseFromInputDTO {
  file: Express.Multer.File;
  subject: string;
  category: string;
  user: User;
}

@Injectable()
export class ExercisesService {
  logger = new Logger(ExercisesService.name);
  constructor(
    @InjectRepository(Exercise)
    private exercisesRepository: Repository<Exercise>,
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

  async create(exercise: Partial<Exercise>): Promise<Exercise> {
    const newExercise = this.exercisesRepository.create(exercise);
    return this.exercisesRepository.save(newExercise);
  }

  async createFromInput(dto: CreateExerciseFromInputDTO): Promise<any> {
    const { file, subject, user, category } = dto;
    const savedInput = await this.input.create(file);
    this.logger.log(`Generating exercise....`);
    const exercisePreview: Partial<Exercise> =
      await this.llm.generateExerciseFromLLMUpload(savedInput.llmUploadData);
    this.logger.log(`Generated exercise`);
    const exercise = await this.create({ ...exercisePreview, createdBy: user });
    return exercisePreview;
  }
}
