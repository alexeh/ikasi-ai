import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsController } from '../src/modules/assignments/assignments.controller';
import { RolesGuard } from '../src/modules/auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../src/modules/users/users.entity';

describe('AssignmentsController', () => {
  let controller: AssignmentsController;
  let rolesGuard: RolesGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignmentsController],
      providers: [RolesGuard, Reflector],
    }).compile();

    controller = module.get<AssignmentsController>(AssignmentsController);
    rolesGuard = module.get<RolesGuard>(RolesGuard);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Role-based access control', () => {
    it('should have RolesGuard applied', () => {
      const guards = Reflect.getMetadata('__guards__', AssignmentsController);
      expect(guards).toBeDefined();
    });

    it('should require TEACHER role', () => {
      const roles = Reflect.getMetadata('roles', AssignmentsController);
      expect(roles).toContain(UserRole.TEACHER);
    });
  });
});
