import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InputsService } from './inputs.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';

@Controller('inputs')
export class InputsController {
  logger: Logger = new Logger(InputsController.name);
  constructor(
    private readonly inputsService: InputsService,
    private readonly s3Service: S3Service,
  ) {}

  @Post('/pdf')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPdfInput(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File not found');
    }
    this.logger.log(file);
    const res = await this.s3Service.upload(file);
    this.logger.log(res);
  }
}
