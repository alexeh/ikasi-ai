import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

console.log('starttt');

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    // TODO: Optimize timeout@@
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/signup (POST)', () => {
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

  describe('/auth/login (POST)', () => {
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
});
