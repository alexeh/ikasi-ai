import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DATABASE_CONFIG_TOKEN } from './database.config';
import { S3ClientConfig } from '@aws-sdk/client-s3';

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) {}

  getDBConfig(): TypeOrmModuleOptions {
    return this.configService.get(
      DATABASE_CONFIG_TOKEN,
    ) as TypeOrmModuleOptions;
  }

  getS3Config(): S3ClientConfig {
    const config: S3ClientConfig = {
      forcePathStyle: true,
      region: this.configService.get('AWS_REGION'),
      endpoint: this.configService.get('S3_ENDPOINT'),
    };
    return config;
  }
}
