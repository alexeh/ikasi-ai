import { Module } from '@nestjs/common';
import { InputsController } from './inputs.controller';
import { InputsService } from './inputs.service';
import { S3Service } from './s3.service';
import { LlmModule } from '../llm/llm.module';

@Module({
  imports: [LlmModule],
  controllers: [InputsController],
  providers: [InputsService, S3Service],
})
export class InputsModule {}
