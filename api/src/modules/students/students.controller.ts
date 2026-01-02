import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/users.entity';

@Controller('students')
@UseGuards(RolesGuard)
@Roles(UserRole.TEACHER)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  findAll(@Query('classId') classId?: string) {
    return this.studentsService.findAll(classId);
  }
}