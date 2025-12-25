// catalog.seeder.ts
import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';
import { Subject } from '../subjects.entity';
import { ACADEMIC_CATALOG } from './catalog';

@Injectable()
export class CatalogSeeder {
  private readonly logger = new Logger(CatalogSeeder.name);

  constructor(private readonly dataSource: DataSource) {}

  async seed(): Promise<void> {
    this.logger.log('Seeding catalog');
    const subjectsRepo = this.dataSource.getRepository(Subject);
    const count = await subjectsRepo.count({});
    if (count > 0) {
      this.logger.warn('Catalog already populated, skipping...');
      return;
    }

    const savedSubjects = await subjectsRepo.save(ACADEMIC_CATALOG.subjects);
    this.logger.log('Catalog seeded');
  }

  private async isPopulated(entity: EntityTarget<ObjectLiteral>) {
    const count = await this.dataSource.getRepository(entity).count({});
    return count > 0;
  }
}
