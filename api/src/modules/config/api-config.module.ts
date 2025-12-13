import { ConfigModule } from '@nestjs/config';
import { validate } from './env.config';
import databaseConfig from './database.config';
import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './api-config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      load: [databaseConfig],
    }),
  ],
  providers: [ApiConfigService],
  exports: [ApiConfigService],
})
export class ApiConfigModule {}
