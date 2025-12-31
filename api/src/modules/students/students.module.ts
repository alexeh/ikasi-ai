import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  providers: [StudentsService],
})
export class StudentsModule {}
