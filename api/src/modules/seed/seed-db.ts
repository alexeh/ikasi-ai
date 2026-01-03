import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';
import * as bcrypt from 'bcrypt';
import seedData from './seed-data.json';
import { User, UserRole } from '../users/users.entity';
import { Teacher } from '../teachers/teacher.entity';
import { Student } from '../students/student.entity';
import { Environment } from '../config/env.config';
import { Class } from '../classes/class.entity';

type SeedUser = {
  email: string;
  password: string;
  name: string;
  lname?: string;
  role: UserRole;
  locale?: string;
  avatar?: string;
};

type SeedRelationship = {
  userEmail: string;
};

type SeedStudent = SeedRelationship & {
  className?: string;
};

type SeedClass = {
  name: string;
  teacherEmails?: string[];
};

type SeedData = {
  users: SeedUser[];
  teachers: SeedRelationship[];
  students: SeedStudent[];
  classes?: SeedClass[];
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
    this.logger.log('Seeding users, teachers, classes and students');
    const alreadyPopulated = await this.hasExistingData();
    if (alreadyPopulated) {
      this.logger.warn(
        'Seed data already present, skipping users/teachers/students seeding',
      );
      return;
    }

    const users = await this.createUsers();
    const teachers = await this.createTeachers(users);
    const classes = await this.createClasses(users, teachers);
    await this.createStudents(users, classes);
    this.logger.log('Users, teachers, classes and students seed complete');
  }

  private async hasExistingData(): Promise<boolean> {
    const [
      usersPopulated,
      teachersPopulated,
      studentsPopulated,
      classesPopulated,
    ] = await Promise.all([
      this.isPopulated(User),
      this.isPopulated(Teacher),
      this.isPopulated(Student),
      this.isPopulated(Class),
    ]);

    return (
      usersPopulated ||
      teachersPopulated ||
      studentsPopulated ||
      classesPopulated
    );
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

  private async createClasses(
    users: User[],
    teachers: Teacher[],
  ): Promise<Class[]> {
    const classRepo = this.dataSource.getRepository(Class);
    const teachersByEmail = this.mapTeachersByEmail(users, teachers);

    const classes = (SEED_DATA.classes ?? []).map((seedClass) => {
      const classTeachers = (seedClass.teacherEmails ?? []).map((email) => {
        const teacher = teachersByEmail.get(email);
        if (!teacher) {
          throw new Error(
            `No teacher found for class seed with email ${email}`,
          );
        }

        return teacher;
      });

      return classRepo.create({
        name: seedClass.name,
        teachers: classTeachers,
      });
    });

    if (classes.length === 0) {
      return [];
    }

    return classRepo.save(classes);
  }

  private async createStudents(
    users: User[],
    classes: Class[],
  ): Promise<Student[]> {
    const studentRepo = this.dataSource.getRepository(Student);
    const usersByEmail = this.mapUsersByEmail(users);
    const classesByName = this.mapClassesByName(classes);

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

      const studentClass = student.className
        ? classesByName.get(student.className)
        : undefined;

      if (student.className && !studentClass) {
        throw new Error(
          `No class found for student seed with class ${student.className}`,
        );
      }

      return studentRepo.create({ user, userId: user.id, studentClass });
    });

    if (students.length === 0) {
      return [];
    }

    return studentRepo.save(students);
  }

  private mapUsersByEmail(users: User[]): Map<string, User> {
    return new Map(users.map((user) => [user.email, user]));
  }

  private mapTeachersByEmail(
    users: User[],
    teachers: Teacher[],
  ): Map<string, Teacher> {
    const teachersByUserId = new Map(
      teachers.map((teacher) => [teacher.userId, teacher]),
    );

    return new Map(
      users
        .filter((user) => teachersByUserId.has(user.id))
        .map((user) => [user.email, teachersByUserId.get(user.id)!]),
    );
  }

  private mapClassesByName(classes: Class[]): Map<string, Class> {
    return new Map(classes.map((clas) => [clas.name, clas]));
  }

  private async isPopulated(
    entity: EntityTarget<ObjectLiteral>,
  ): Promise<boolean> {
    const count = await this.dataSource.getRepository(entity).count({});
    return count > 0;
  }
}
