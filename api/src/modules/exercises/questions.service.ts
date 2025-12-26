import { Injectable } from '@nestjs/common';
import { Question } from './questions.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Exercise } from './exercise.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly repo: Repository<Question>,
  ) {}

  async create(questions: Question[]): Promise<Exercise> {
    return '' as any;
  }
}
