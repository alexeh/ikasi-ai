import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { S3Service } from './s3.service';
import { LlmService } from '../llm/llm.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Input } from './inputs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InputsService {
  logger = new Logger(InputsService.name);
  constructor(
    private readonly s3Service: S3Service,
    private readonly llm: LlmService,
    @InjectRepository(Input) private readonly repo: Repository<Input>,
  ) {}

  async create(inputs: Express.Multer.File) {
    this.logger.log(`Uploading file: ${inputs.filename}`);
    try {
      const s3UploadData = await this.s3Service.upload(inputs);
      const llmUploadData = await this.llm.uploadFileToLLM(inputs);
      const savedInput = await this.repo.save({
        s3UploadData,
        llmUploadData,
      });
      // const exercise: any =
      //   await this.llm.generateExerciseFromLLMUpload(llmUploadData);
      this.logger.log(`Input created: `, savedInput);
      return llmUploadData;
    } catch (error) {
      this.logger.error(`Error creating input: `, error);
      throw new ServiceUnavailableException(error);
    }
  }
}
