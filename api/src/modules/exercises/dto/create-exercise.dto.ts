import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ExerciseStatus } from '@shared/entities/exercise';

export class CreateExerciseDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(ExerciseStatus)
  status?: ExerciseStatus;
}
