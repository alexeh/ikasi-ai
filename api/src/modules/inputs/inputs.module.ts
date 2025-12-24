import { Module } from '@nestjs/common';
import { InputsController } from './inputs.controller';
import { InputsService } from './inputs.service';
import { S3Service } from './s3.service';
import { LlmModule } from '../llm/llm.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Input } from './inputs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Input]), LlmModule],
  controllers: [InputsController],
  providers: [InputsService, S3Service],
  exports: [InputsService],
})
export class InputsModule {}
