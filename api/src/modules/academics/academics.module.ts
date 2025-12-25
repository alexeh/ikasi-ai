import { Module } from '@nestjs/common';
import { AcademicsService } from './academics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './subjects.entity';
import { SubjectCategory } from './subject-categories.entity';
import { CatalogSeeder } from './catalog/catalog.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, SubjectCategory])],
  providers: [AcademicsService, CatalogSeeder],
  exports: [AcademicsService, CatalogSeeder],
})
export class AcademicsModule {}
