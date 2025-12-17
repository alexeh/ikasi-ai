import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Environment } from './env.config';

export const DATABASE_CONFIG_TOKEN = Symbol('DATABASE_CONFIG');

export default registerAs(DATABASE_CONFIG_TOKEN, (): TypeOrmModuleOptions => {
  if (process.env.NODE_ENV === Environment.Development) {
    return {
      host: 'localhost',
      port: 5432,
      username: 'ikasi-ai',
      password: 'ikasi-ai',
      database: 'ikasi-ai',
      type: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    };
  }

  return {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    type: 'postgres',
    autoLoadEntities: true,
    synchronize: true,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
  };
});
