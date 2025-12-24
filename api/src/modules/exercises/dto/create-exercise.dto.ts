import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ExerciseStatus, ICreateExerciseDto } from '@ikasi-ai/shared';

export class CreateExerciseDto implements ICreateExerciseDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(ExerciseStatus)
  status?: ExerciseStatus;
}
