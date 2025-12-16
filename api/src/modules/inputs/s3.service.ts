import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ApiConfigService } from '../config/api-config.service';

@Injectable()
export class S3Service {
  s3Client: S3Client;
  bucketName: string;
  constructor(private readonly apiConfigService: ApiConfigService) {
    this.s3Client = new S3Client({
      region: 'eu-west-3',
      credentials: { accessKeyId: '', secretAccessKey: '' },
    });
    this.bucketName = 'ikasi-ai-inputs';
  }

  async upload(file: Express.Multer.File) {
    const uploadCommand = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: file.originalname,
      Body: file.buffer,
    });

    return this.s3Client.send(uploadCommand);
  }
}
