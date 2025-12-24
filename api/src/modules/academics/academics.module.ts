import { Module } from '@nestjs/common';
import { AcademicsService } from './academics.service';

@Module({
  providers: [AcademicsService]
})
export class AcademicsModule {}
