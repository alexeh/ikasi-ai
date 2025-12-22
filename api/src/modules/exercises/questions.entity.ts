// src/modules/questions/question.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
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

@Entity({ name: 'questions' })
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Exercise, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;

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
