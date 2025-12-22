import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, validateSync } from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvConfig {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  PORT: number = 3000;

  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_DATABASE: string;

  @IsOptional()
  @IsString()
  AWS_REGION?: string;

  @IsOptional()
  @IsString()
  S3_BUCKET_NAME?: string;

  @IsOptional()
  @IsString()
  S3_ENDPOINT?: string;

  @IsOptional()
  @IsString()
  AWS_ACCESS_KEY?: string;

  @IsOptional()
  @IsString()
  AWS_SECRET_ACCESS_KEY?: string;

  @IsString()
  JWT_SECRET: string;
}

export function validate(config: Record<string, unknown>) {
  const normalizedConfig: Record<string, unknown> = {
    ...config,
  };

  const nodeEnv =
    typeof normalizedConfig.NODE_ENV === 'string'
      ? normalizedConfig.NODE_ENV
      : undefined;

  if (!nodeEnv) {
    normalizedConfig.NODE_ENV = Environment.Development;
  }

  const nodeEnvValue = String(normalizedConfig.NODE_ENV).toLowerCase();

  if (nodeEnvValue === Environment.Development) {
    normalizedConfig.DB_HOST ??= 'localhost';
    normalizedConfig.DB_PORT ??= 5432;
    normalizedConfig.DB_USERNAME ??= 'ikasi-ai';
    normalizedConfig.DB_PASSWORD ??= 'ikasi-ai';
    normalizedConfig.DB_DATABASE ??= 'ikasi-ai';
    normalizedConfig.JWT_SECRET ??= 'dev-secret-change-in-production';
  }

  const validatedConfig = plainToInstance(EnvConfig, normalizedConfig, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
