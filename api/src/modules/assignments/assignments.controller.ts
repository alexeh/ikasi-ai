import { Controller, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/users.entity';

@Controller('assignments')
@UseGuards(RolesGuard)
@Roles(UserRole.TEACHER)
export class AssignmentsController {}
