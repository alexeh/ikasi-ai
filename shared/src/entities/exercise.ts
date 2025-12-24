// Shared Exercise types that can be used by both frontend and backend

export enum ExerciseStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  ARCHIVED = 'ARCHIVED',
}

// Base interface for Exercise without TypeORM-specific properties
export interface IExercise {
  id: string;
  status: ExerciseStatus;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}
