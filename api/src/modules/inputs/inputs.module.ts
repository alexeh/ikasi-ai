import { Module } from '@nestjs/common';
import { InputsController } from './inputs.controller';
import { InputsService } from './inputs.service';
import { S3Service } from './s3.service';

@Module({
  controllers: [InputsController],
  providers: [InputsService, S3Service],
})
export class InputsModule {}
