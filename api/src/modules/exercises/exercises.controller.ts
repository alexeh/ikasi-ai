import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/users.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';

// RolesGuard works in conjunction with the globally configured JwtAuthGuard
// The JwtAuthGuard runs first to authenticate the user, then RolesGuard checks roles
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
}
