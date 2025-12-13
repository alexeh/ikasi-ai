import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DATABASE_CONFIG_TOKEN } from './database.config';

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) {}

  getDBConfig(): TypeOrmModuleOptions {
    return this.configService.get(
      DATABASE_CONFIG_TOKEN,
    ) as TypeOrmModuleOptions;
  }
}
