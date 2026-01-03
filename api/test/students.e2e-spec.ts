import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';
import { clearTablesByEntities } from './lib/db-helpers';
import { Student } from '../src/modules/students/student.entity';
import { Class } from '../src/modules/classes/class.entity';
import { User, UserRole } from '../src/modules/users/users.entity';
import { AppModule } from '../src/app.module';

describe('Students (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let teacherToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get(DataSource);
    await app.init();

    // Create a teacher user and get token
    const teacherResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: `teacher-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Teacher',
        lname: 'Test',
        role: UserRole.TEACHER,
        locale: 'eu',
      });

    teacherToken = teacherResponse.body.access_token;
  }, 30000);

  afterEach(async () => {
    await clearTablesByEntities(dataSource, [Student, Class, User]);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /students', () => {
    it('should return empty array when no students exist', async () => {
      return request(app.getHttpServer())
        .get('/students')
        .set('Authorization', `Bearer ${teacherToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(0);
        });
    });

    it('should require authentication', async () => {
      return request(app.getHttpServer()).get('/students').expect(401);
    });

    it('should return all students when no classId filter is provided', async () => {
      // Create students
      const student1Response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: `student1-${Date.now()}@example.com`,
          password: 'password123',
          name: 'Student',
          lname: 'One',
          role: UserRole.STUDENT,
          locale: 'eu',
        });

      const student2Response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: `student2-${Date.now()}@example.com`,
          password: 'password123',
          name: 'Student',
          lname: 'Two',
          role: UserRole.STUDENT,
          locale: 'eu',
        });

      expect(student1Response.status).toBe(201);
      expect(student2Response.status).toBe(201);

      // Fetch all students
      return request(app.getHttpServer())
        .get('/students')
        .set('Authorization', `Bearer ${teacherToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('user');
          expect(res.body[0].user).toHaveProperty('name');
          expect(res.body[0].user).toHaveProperty('email');
        });
    });

    it('should filter students by classId when provided', async () => {
      // Create a class
      const classRepository = dataSource.getRepository(Class);
      const testClass = await classRepository.save({
        name: 'Test Class',
      });

      // Create students with class assignment
      const userRepository = dataSource.getRepository(User);
      const studentRepository = dataSource.getRepository(Student);

      const user1 = await userRepository.save({
        email: `student-class-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Student',
        lname: 'InClass',
        role: UserRole.STUDENT,
        locale: 'eu',
      });

      await studentRepository.save({
        userId: user1.id,
        studentClass: testClass,
      });

      const user2 = await userRepository.save({
        email: `student-noclass-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Student',
        lname: 'NoClass',
        role: UserRole.STUDENT,
        locale: 'eu',
      });

      await studentRepository.save({
        userId: user2.id,
      });

      // Fetch students by classId
      return request(app.getHttpServer())
        .get(`/students?classId=${testClass.id}`)
        .set('Authorization', `Bearer ${teacherToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(1);
          expect(res.body[0].studentClass.id).toBe(testClass.id);
          expect(res.body[0].user.lname).toBe('InClass');
        });
    });
  });
});
