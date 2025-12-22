import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Exercise } from './exercise.entity';

export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  OPEN = 'OPEN',
}

export enum QuestionTopic {
  EUSKARANCE = 'EUSKARA',
  ENGLISH = 'ENGLISH',
  CASTELLANOUS = 'CASTELLANOUS',
  MATHER = 'MATH',
}

// TODO: Probably exercises and questions should be relatable N to N, so we can have a pool of questions that can be assigned to a new exercises
//       created in-app

@Entity({ name: 'questions' })
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Exercise)
  @JoinTable({
    name: 'exercise_questions',
    joinColumn: {
      name: 'questions',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'exercises',
      referencedColumnName: 'id',
    },
  })
  exercises: Exercise[];

  @Column({ type: 'enum', enum: QuestionType })
  type: QuestionType;

  @Column({ type: 'text' })
  prompt: string;

  // Optional explanation / LLM hint
  @Column({ type: 'text', nullable: true })
  explanation?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'enum', enum: QuestionTopic })
  topic: QuestionTopic;
}
