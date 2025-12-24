import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { InputsService } from '../inputs/inputs.service';
import { LlmService } from '../llm/llm.service';
import { User } from '../users/users.entity';

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
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid exercise ID');
    }
    const result = await this.exercisesRepository.findOneBy({
      id: numericId,
    });
    return result ?? undefined;
  }

  async create(exercise: Partial<Exercise>): Promise<Exercise> {
    const newExercise = this.exercisesRepository.create(exercise);
    return this.exercisesRepository.save(newExercise);
  }

  async createFromInput(
    file: Express.Multer.File,
    user: User,
  ): Promise<Exercise> {
    const savedInput = await this.input.create(file);
    this.logger.log(`Generating exercise....`);
    const exercisePreview: Partial<Exercise> =
      await this.llm.generateExerciseFromLLMUpload(savedInput.llmUploadData);
    this.logger.log(`Generated exercise`);
    return this.create({ ...exercisePreview, createdBy: user });
  }
}
