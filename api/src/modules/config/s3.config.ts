import { registerAs } from '@nestjs/config';
import { S3ClientConfig } from '@aws-sdk/client-s3';
import * as process from 'node:process';

export const S3_CONFIG_TOKEN = Symbol('S3_CONFIG_TOKEN');

export default registerAs(
  S3_CONFIG_TOKEN,
  (): S3ClientConfig => ({
    forcePathStyle: true,
    region: process.env.AWS_REGION,
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  }),
);
