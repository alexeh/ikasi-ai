import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User, UserRole } from '../users/users.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// RolesGuard works in conjunction with the globally configured JwtAuthGuard
// The JwtAuthGuard runs first to authenticate the user, then RolesGuard checks roles
import { v4 as uuidv4 } from 'uuid';
import { GetUser } from '../auth/decorators/get-user.decorator';

const uploadDir = join(process.cwd(), 'tmp', 'uploads');

// ensure dir exists at startup
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

@Controller('exercises')
@UseGuards(RolesGuard)
@Roles(UserRole.TEACHER)
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get()
  findAll() {
    return this.exercisesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }

  @Post()
  create(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exercisesService.create(createExerciseDto);
  }

  @Post('/input')
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
  createByInput(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    console.log({ user });
    return this.exercisesService.createFromInput(file, user);
  }
}
