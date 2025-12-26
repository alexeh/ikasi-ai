import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { SubjectCategory } from './subject-categories.entity';
import { Question } from '../exercises/questions.entity';

export enum SubjectCode {
  EUSKARA = 'euskara',
  GAZTELERA = 'gaztelera',
  INGURU = 'inguru',
  MATEMATIKA = 'matematika',
  INGLESA = 'ingelesa',
}

@Entity('subjects')
export class Subject {
  @PrimaryColumn({ type: 'varchar', name: 'id' })
  id: SubjectCode;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(
    () => SubjectCategory,
    (categories: SubjectCategory) => categories.subject,
    {
      cascade: ['insert'],
    },
  )
  categories: SubjectCategory[];

  @OneToMany(() => Question, (question: Question) => question.subject)
  questions: Question[];
}
