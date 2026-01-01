import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { Teacher } from './teacher.entity';

@Injectable()
export class TeachersAuthService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  async addUserAsTeacher(user: User): Promise<Teacher> {
    const teacher = this.teacherRepository.create({ user });
    return this.teacherRepository.save(teacher);
  }
}
