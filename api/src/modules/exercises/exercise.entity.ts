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
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Input } from '../inputs/inputs.entity';
import { User } from '../users/users.entity';
import { Question } from './questions.entity';

export enum ExerciseStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  ARCHIVED = 'ARCHIVED',
}

@Entity({ name: 'exercises' })
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'email' })
  createdBy?: User;

  @OneToOne(() => Input, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'input_id' })
  input?: Input;

  @Column({ type: 'enum', enum: ExerciseStatus, default: ExerciseStatus.DRAFT })
  status: ExerciseStatus;

  @ManyToMany(() => Question, (questions) => questions, { cascade: ['insert'] })
  @JoinTable({
    name: 'exercise_questions',
    joinColumn: {
      name: 'questions_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'exercises_id',
      referencedColumnName: 'id',
    },
  })
  questions: Question[];

  @Column({ nullable: true })
  title?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
