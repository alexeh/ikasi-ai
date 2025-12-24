import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SubjectCategory } from './subject-categories.entity';

export enum SubjectCode {
  EUSKARA = 'euskara',
  GAZTELERA = 'gaztelera',
  INGURU = 'inguru',
  MATEMATIKA = 'matematika',
  INGLESA = 'ingelesa',
}

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true, type: 'enum', enum: SubjectCode })
  code: SubjectCode;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(
    () => SubjectCategory,
    (categories: SubjectCategory) => categories.subject,
  )
  categories: SubjectCategory[];
}
