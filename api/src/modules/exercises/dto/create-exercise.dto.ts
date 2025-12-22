import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ExerciseStatus } from '../exercise.entity';

export class CreateExerciseDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(ExerciseStatus)
  status?: ExerciseStatus;
}
