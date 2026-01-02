import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';
import * as bcrypt from 'bcrypt';
import seedData from './seed-data.json';
import { User, UserRole } from '../users/users.entity';
import { Teacher } from '../teachers/teacher.entity';
import { Student } from '../students/student.entity';
import { Environment } from '../config/env.config';

type SeedUser = {
  email: string;
  password: string;
  name: string;
  lname?: string;
  role: UserRole;
  locale?: string;
};

type SeedRelationship = {
  userEmail: string;
};

type SeedData = {
  users: SeedUser[];
  teachers: SeedRelationship[];
  students: SeedRelationship[];
};

const SEED_DATA = seedData as SeedData;

@Injectable()
export class SeedDbService {
  private readonly logger = new Logger(SeedDbService.name);

  constructor(private readonly dataSource: DataSource) {}

  async seed(): Promise<void> {
    if (process.env.NODE_ENV === Environment.Test) {
      this.logger.warn('Skipping seeding in test environment');
      return;
    }
    this.logger.log('Seeding users, teachers and students');
    const alreadyPopulated = await this.hasExistingData();
    if (alreadyPopulated) {
      this.logger.warn(
        'Seed data already present, skipping users/teachers/students seeding',
      );
      return;
    }

    const users = await this.createUsers();
    await this.createTeachers(users);
    await this.createStudents(users);
    this.logger.log('Users, teachers and students seed complete');
  }

  private async hasExistingData(): Promise<boolean> {
    const [usersPopulated, teachersPopulated, studentsPopulated] =
      await Promise.all([
        this.isPopulated(User),
        this.isPopulated(Teacher),
        this.isPopulated(Student),
      ]);

    return usersPopulated || teachersPopulated || studentsPopulated;
  }

  private async createUsers(): Promise<User[]> {
    const userRepo = this.dataSource.getRepository(User);
    const usersWithHashedPasswords = await Promise.all(
      SEED_DATA.users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      })),
    );

    const createdUsers = userRepo.create(usersWithHashedPasswords);
    return userRepo.save(createdUsers);
  }

  private async createTeachers(users: User[]): Promise<Teacher[]> {
    const teacherRepo = this.dataSource.getRepository(Teacher);
    const usersByEmail = this.mapUsersByEmail(users);

    const teachers = SEED_DATA.teachers.map((teacher) => {
      const user = usersByEmail.get(teacher.userEmail);
      if (!user) {
        throw new Error(
          `No user found for teacher seed with email ${teacher.userEmail}`,
        );
      }
      if (user.role !== UserRole.TEACHER) {
        throw new Error(
          `User ${user.email} must have teacher role to be seeded as teacher`,
        );
      }

      return teacherRepo.create({ user, userId: user.id });
    });

    if (teachers.length === 0) {
      return [];
    }

    return teacherRepo.save(teachers);
  }

  private async createStudents(users: User[]): Promise<Student[]> {
    const studentRepo = this.dataSource.getRepository(Student);
    const usersByEmail = this.mapUsersByEmail(users);

    const students = SEED_DATA.students.map((student) => {
      const user = usersByEmail.get(student.userEmail);
      if (!user) {
        throw new Error(
          `No user found for student seed with email ${student.userEmail}`,
        );
      }
      if (user.role !== UserRole.STUDENT) {
        throw new Error(
          `User ${user.email} must have student role to be seeded as student`,
        );
      }

      return studentRepo.create({ user, userId: user.id });
    });

    if (students.length === 0) {
      return [];
    }

    return studentRepo.save(students);
  }

  private mapUsersByEmail(users: User[]): Map<string, User> {
    return new Map(users.map((user) => [user.email, user]));
  }

  private async isPopulated(
    entity: EntityTarget<ObjectLiteral>,
  ): Promise<boolean> {
    const count = await this.dataSource.getRepository(entity).count({});
    return count > 0;
  }
}
