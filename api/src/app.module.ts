import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiConfigModule } from './modules/config/api-config.module';
import { ApiConfigService } from './modules/config/api-config.service';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ApiConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) =>
        configService.getDBConfig(),
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
