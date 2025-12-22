import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './exercise.entity';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private exercisesRepository: Repository<Exercise>,
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
}
