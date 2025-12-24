// src/modules/exercises/exercise.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Input } from '../inputs/inputs.entity';
import { User } from '../users/users.entity';
import { Question } from './questions.entity';
import { ExerciseStatus, IExercise } from '@ikasi-ai/shared';

@Entity({ name: 'exercises' })
export class Exercise implements IExercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy?: User;

  @OneToOne(() => Input, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'input_id' })
  input?: Input;

  @Column({ type: 'enum', enum: ExerciseStatus, default: ExerciseStatus.DRAFT })
  status: ExerciseStatus;

  @ManyToOne(() => Question, (questions) => questions.exercises)
  questions: Question[];

  @Column({ nullable: true })
  title?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
