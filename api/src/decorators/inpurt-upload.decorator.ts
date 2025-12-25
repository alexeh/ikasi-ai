import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 } from 'uuid';

interface InputUploadOptions {
  fileType: 'pdf' | 'docx';
}

const uploadDir = join(process.cwd(), 'tmp', 'uploads');

if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

export function UploadInput(options?: InputUploadOptions) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: (_req, _file, cb) => {
            cb(null, uploadDir);
          },
          filename: (_req, file, cb) => {
            const name: string = `${v4()}${file.originalname}`;
            cb(null, name);
          },
        }),
      }),
    ),
  );
}
