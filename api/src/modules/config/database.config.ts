import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const DATABASE_CONFIG_TOKEN = Symbol('DATABASE_CONFIG');

export default registerAs(
  DATABASE_CONFIG_TOKEN,
  (): TypeOrmModuleOptions => ({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    type: 'postgres',
    autoLoadEntities: true,
    synchronize: true,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
  }),
);
