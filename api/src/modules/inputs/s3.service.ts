import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ApiConfigService } from '../config/api-config.service';

@Injectable()
export class S3Service {
  logger = new Logger(S3Service.name);
  s3Client: S3Client;
  bucketName: string;
  constructor(private readonly apiConfigService: ApiConfigService) {
    this.s3Client = new S3Client(this.apiConfigService.getS3Config());
    this.bucketName = 'ikasi-ai-inputs';
  }

  async upload(file: Express.Multer.File) {
    try {
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: file.originalname,
        Body: file.buffer,
      });

      const response = await this.s3Client.send(uploadCommand);
      this.logger.log('File uploaded successfully.');
      return response;
    } catch (error) {
      this.logger.error(`Upload failed: ${error}`);
    }
  }
}
