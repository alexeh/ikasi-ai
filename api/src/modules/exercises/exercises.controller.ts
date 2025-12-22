import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/users.entity';

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
  create(@Body() createExerciseDto: any) {
    return this.exercisesService.create(createExerciseDto);
  }
}
