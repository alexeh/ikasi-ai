import { Injectable } from '@nestjs/common';
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

  async findOne(id: string): Promise<Exercise | null> {
    return this.exercisesRepository.findOneBy({ id: parseInt(id, 10) });
  }

  async create(exercise: Partial<Exercise>): Promise<Exercise> {
    const newExercise = this.exercisesRepository.create(exercise);
    return this.exercisesRepository.save(newExercise);
  }
}
