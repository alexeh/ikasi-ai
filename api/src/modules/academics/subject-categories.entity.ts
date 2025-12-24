import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  JoinColumn,
} from 'typeorm';
import { Subject } from './subjects.entity';

export enum SubjectCategoryCode {
  KALKULU_MENTALA = 'kalkulu_mentala',
  ARITMETIKA = 'aritmetika',
  BURUKETAK = 'buruketak',

  ULERMENA = 'ulermena',
  IDAZMENA = 'idazmena',
  GRAMATIKA = 'gramatika',
  LEXIKOA = 'lexikoa',
}

@Entity('subject_categories')
@Unique(['subject', 'code'])
export class SubjectCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Subject, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @Column({ type: 'enum', enum: SubjectCategoryCode })
  code: SubjectCategoryCode;

  @Column()
  label: string;

  @Column({ nullable: true })
  order?: number;
}
