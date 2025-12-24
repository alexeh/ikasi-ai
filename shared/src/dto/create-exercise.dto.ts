import { ExerciseStatus } from '../entities/exercise';

// Base DTO for creating an exercise
export interface ICreateExerciseDto {
  title?: string;
  status?: ExerciseStatus;
}
