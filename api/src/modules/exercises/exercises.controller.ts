import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User, UserRole } from '../users/users.entity';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { SubjectCode } from '../academics/subjects.entity';
import { SubjectCategoryCode } from '../academics/subject-categories.entity';
import { UploadInput } from '../../decorators/inpurt-upload.decorator';

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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return this.exercisesService.update(id, updateExerciseDto);
  }

  // @Post()
  // create(@Body() createExerciseDto: CreateExerciseDto) {
  //   return this.exercisesService.create(createExerciseDto);
  // }

  @Post(':subject/:category/input')
  @UploadInput()
  createByInput(
    @UploadedFile() file: Express.Multer.File,
    @Param('subject') subject: SubjectCode,
    @Param('category') category: SubjectCategoryCode,
    @GetUser() user: User,
  ) {
    return this.exercisesService.createFromInput({
      file,
      subject,
      category,
      user,
    });
  }
}
