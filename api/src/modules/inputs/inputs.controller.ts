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
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { v4 as uuidv4 } from 'uuid';

const uploadDir = join(process.cwd(), 'tmp', 'uploads');

// ensure dir exists at startup
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

@Controller('inputs')
export class InputsController {
  logger: Logger = new Logger(InputsController.name);
  constructor(private readonly inputsService: InputsService) {}

  @Post('/pdf')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, uploadDir);
        },
        filename: (_req, file, cb) => {
          const name = `${uuidv4()}${file.originalname}`;
          cb(null, name);
        },
      }),
    }),
  )
  async uploadPdfInput(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File not found');
    }
    //const res = await this.s3Service.upload(file);

    const res = await this.inputsService.create(file);
    this.logger.log(res);
    return res;
  }
}
