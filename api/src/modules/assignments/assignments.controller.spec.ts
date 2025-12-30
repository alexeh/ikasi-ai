import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsController } from './assignments.controller';
import { RolesGuard } from '../auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../users/users.entity';

describe('AssignmentsController', () => {
  let controller: AssignmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignmentsController],
      providers: [RolesGuard, Reflector],
    }).compile();

    controller = module.get<AssignmentsController>(AssignmentsController);
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
