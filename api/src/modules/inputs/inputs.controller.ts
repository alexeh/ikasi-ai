import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InputsService } from './inputs.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('inputs')
export class InputsController {
  constructor(private readonly inputsService: InputsService) {}

  @Post('/pdf')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPdfInput(@UploadedFile() file: Express.Multer.File) {}
}
