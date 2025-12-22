import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './exercise.entity';
import { Question } from './questions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise, Question])],
  providers: [ExercisesService],
})
export class ExercisesModule {}
