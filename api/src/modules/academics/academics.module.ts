import { Module } from '@nestjs/common';
import { AcademicsService } from './academics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './subjects.entity';
import { SubjectCategory } from './subject-categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, SubjectCategory])],
  providers: [AcademicsService],
})
export class AcademicsModule {}
