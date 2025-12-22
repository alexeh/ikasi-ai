import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthModule } from '../src/modules/auth/auth.module';
import { UsersModule } from '../src/modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { validate } from '../src/modules/config/env.config';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          validate,
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'ikasi-ai',
          password: 'ikasi-ai',
          database: 'ikasi-ai-test',
          autoLoadEntities: true,
          synchronize: true,
        }),
        AuthModule,
        UsersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

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
