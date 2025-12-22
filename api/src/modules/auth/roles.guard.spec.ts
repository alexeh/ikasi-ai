import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../users/users.entity';
import { ROLES_KEY } from './decorators/roles.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let mockExecutionContext: ExecutionContext;
    let mockRequest: any;

    beforeEach(() => {
      mockRequest = {
        user: null,
      };

      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as any;
    });

    it('should return true when no roles are required', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user is not authenticated', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.TEACHER]);
      mockRequest.user = null;

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        new ForbiddenException('User not authenticated'),
      );
    });

    it('should return true when user has the required teacher role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.TEACHER]);
      mockRequest.user = {
        userId: '123',
        email: 'teacher@example.com',
        role: UserRole.TEACHER,
      };

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user does not have required role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.TEACHER]);
      mockRequest.user = {
        userId: '123',
        email: 'student@example.com',
        role: UserRole.STUDENT,
      };

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        new ForbiddenException('User does not have the required role'),
      );
    });

    it('should return true when user has one of multiple required roles', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
        UserRole.TEACHER,
        UserRole.ADMIN,
      ]);
      mockRequest.user = {
        userId: '123',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
      };

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should call reflector with correct parameters', () => {
      const getAllAndOverrideSpy = jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      guard.canActivate(mockExecutionContext);

      expect(getAllAndOverrideSpy).toHaveBeenCalledWith(ROLES_KEY, [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
    });
  });
});
