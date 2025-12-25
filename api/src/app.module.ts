import { Module, OnModuleInit } from '@nestjs/common';
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
import { AcademicsModule } from './modules/academics/academics.module';
import { CatalogSeeder } from './modules/academics/catalog/catalog.seeder';

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
    AcademicsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seeder: CatalogSeeder) {}

  async onModuleInit(): Promise<void> {
    await this.seeder.seed();
  }
}
