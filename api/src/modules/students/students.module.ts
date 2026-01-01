import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { StudentsAuthService } from './students-auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  providers: [StudentsService, StudentsAuthService],
  exports: [StudentsService, StudentsAuthService],
})
export class StudentsModule {}
