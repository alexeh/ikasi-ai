import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiConfigModule } from './modules/config/api-config.module';
import { ApiConfigService } from './modules/config/api-config.service';
import { UsersModule } from './modules/users/users.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { InputsModule } from './modules/inputs/inputs.module';
import { LlmModule } from './modules/llm/llm.module';
import { LlmService } from './modules/llm/llm.service';

@Module({
  imports: [
    ApiConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) =>
        configService.getDBConfig(),
    }),
    UsersModule,
    AssignmentsModule,
    InputsModule,
    LlmModule,
  ],
  controllers: [AppController],
  providers: [AppService, LlmService],
})
export class AppModule {}
