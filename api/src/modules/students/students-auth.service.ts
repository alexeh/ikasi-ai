import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';

@Injectable()
export class StudentsAuthService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async addUserAsStudent(user: User): Promise<Student> {
    const student = this.studentRepository.create({ user });
    return this.studentRepository.save(student);
  }
}
