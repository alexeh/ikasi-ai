import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import { clearTablesByEntities } from '../lib/db-helpers';
import { Teacher } from '../../src/modules/teachers/teacher.entity';
import { User } from '../../src/modules/users/users.entity';
import { Student } from '../../src/modules/students/student.entity';
import { afterEach } from 'node:test';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get(DataSource);
    await app.init();
    // TODO: Optimize timeout@@
  }, 30000);

  afterEach(async () => {
    await clearTablesByEntities(dataSource, [User]);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Sign-Up', () => {
    it('should create a new user and return a token', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: `test-${Date.now()}@example.com`,
          password: 'password123',
          name: 'Test',
          lname: 'User',
          role: 'student',
          locale: 'eu',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(typeof res.body.access_token).toBe('string');
        });
    });

    it('should fail with duplicate email', async () => {
      const email = `duplicate-${Date.now()}@example.com`;

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email,
          password: 'password123',
          name: 'Test',
          role: 'student',
        })
        .expect(201);

      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email,
          password: 'password123',
          name: 'Test',
          role: 'student',
        })
        .expect(409);
    });
  });

  describe('Login', () => {
    it('should login and return a token', async () => {
      const email = `login-test-${Date.now()}@example.com`;
      const password = 'password123';

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email,
          password,
          name: 'Test',
          role: 'teacher',
        })
        .expect(201);

      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email,
          password,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(typeof res.body.access_token).toBe('string');
        });
    });

    it('should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe.only('Set new User as Teacher or Student', () => {
    it('should set user as teacher if the user role is teacher', async () => {
      const email = `teacher@example.com`;
      const password = 'password123';
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email,
          password,
          name: 'Test',
          role: 'teacher',
        })
        .expect(201);

      const teacher = await dataSource.getRepository(Teacher).find();
      const user = await dataSource
        .getRepository(User)
        .findOneOrFail({ where: { id: teacher[0].userId } });

      expect(user.email).toEqual(email);
    });
    it('should set user as student if the user role is student', async () => {
      const email = `student@example.com`;
      const password = 'password123';
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email,
          password,
          name: 'Test',
          role: 'student',
        })
        .expect(201);

      const students = await dataSource.getRepository(Student).find();
      const user = await dataSource
        .getRepository(User)
        .findOneOrFail({ where: { id: students[0].userId } });

      expect(user.email).toEqual(email);
    });
  });
});
