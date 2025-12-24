import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { type FileUploadedToLLM } from '../llm/providers/gemini.provider';

@Entity({ name: 'inputs' })
export class Input {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.inputs, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ type: 'jsonb', name: 's3_upload_data' })
  s3UploadData: any;

  @Column({ type: 'jsonb', name: 'llm_upload_data' })
  llmUploadData: FileUploadedToLLM;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createDate: Date;
}
