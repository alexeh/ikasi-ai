// catalog.seeder.ts
import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Subject } from '../subjects.entity';
import { ACADEMIC_CATALOG } from './catalog';

@Injectable()
export class CatalogSeeder {
  private readonly logger = new Logger(CatalogSeeder.name);

  constructor(private readonly dataSource: DataSource) {}

  async seed(): Promise<void> {
    this.logger.log('Seeding catalog');
    const subjectsRepo = this.dataSource.getRepository(Subject);
    const savedSubjects = await subjectsRepo.save(ACADEMIC_CATALOG.subjects);
    this.logger.log('Catalog seeded');
  }
}
