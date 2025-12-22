import { Controller, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/users.entity';

// RolesGuard works in conjunction with the globally configured JwtAuthGuard
// The JwtAuthGuard runs first to authenticate the user, then RolesGuard checks roles
@Controller('assignments')
@UseGuards(RolesGuard)
@Roles(UserRole.TEACHER)
export class AssignmentsController {}
