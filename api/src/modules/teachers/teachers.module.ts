import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './teacher.entity';
import { TeachersAuthService } from './teachers-auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher])],
  providers: [TeachersService, TeachersAuthService],
  exports: [TeachersService, TeachersAuthService],
})
export class TeachersModule {}
