import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exercise } from './exercise.entity';
import { Subject } from '../academics/subjects.entity';

export enum QuestionType {
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  OPEN = 'open',
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
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_questions' })
  id: number;

  @ManyToMany(() => Exercise)
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

  @ManyToOne(() => Subject, (subject) => subject.questions)
  @JoinColumn({
    name: 'subject_id',
    foreignKeyConstraintName: 'FK_questions_subject_id',
  })
  subject: Subject;

  @Column({ type: 'varchar', array: true, nullable: true })
  options?: string[];

  @Column({ type: 'int', nullable: true, name: 'correct_answer_idx' })
  correctAnswerIndex: number;
}
