import { ConfigModule } from '@nestjs/config';
import { validate } from './env.config';
import databaseConfig from './database.config';
import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './api-config.service';
import s3Config from './s3.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      load: [databaseConfig, s3Config],
    }),
  ],
  providers: [ApiConfigService],
  exports: [ApiConfigService],
})
export class ApiConfigModule {}
