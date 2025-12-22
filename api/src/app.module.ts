import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
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
import { ExercisesModule } from './modules/exercises/exercises.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';

@Module({
  imports: [
    ApiConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) =>
        configService.getDBConfig(),
    }),
    AuthModule,
    UsersModule,
    AssignmentsModule,
    InputsModule,
    LlmModule,
    ExercisesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LlmService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
