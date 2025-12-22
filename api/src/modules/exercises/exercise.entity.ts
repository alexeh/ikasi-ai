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

export enum ExerciseStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  ARCHIVED = 'ARCHIVED',
}

@Entity({ name: 'exercises' })
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy?: User;

  @OneToOne(() => Input, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'input_id' })
  input?: Input;

  @Column({ type: 'enum', enum: ExerciseStatus, default: ExerciseStatus.DRAFT })
  status: ExerciseStatus;

  @Column({ nullable: true })
  title?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
