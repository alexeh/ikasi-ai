import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../users/users.entity';
import { ROLES_KEY } from './decorators/roles.decorator';

describe('RolesGuard Integration Tests', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesGuard, Reflector],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  describe('Teacher role access scenarios', () => {
    it('should allow teacher to access teacher-protected route', () => {
      // Setup: Teacher trying to access teacher-protected route
      const mockContext = createMockContext(UserRole.TEACHER);
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([UserRole.TEACHER]);

      // Execute
      const result = guard.canActivate(mockContext);

      // Verify
      expect(result).toBe(true);
    });

    it('should deny student access to teacher-protected route', () => {
      // Setup: Student trying to access teacher-protected route
      const mockContext = createMockContext(UserRole.STUDENT);
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([UserRole.TEACHER]);

      // Execute & Verify
      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        'User does not have the required role',
      );
    });

    it('should deny unauthenticated access to teacher-protected route', () => {
      // Setup: No user (unauthenticated) trying to access teacher-protected route
      const mockContext = createMockContext(null);
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([UserRole.TEACHER]);

      // Execute & Verify
      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        'User not authenticated',
      );
    });

    it('should allow admin to access teacher-protected route when admin is also allowed', () => {
      // Setup: Admin trying to access route that allows both teacher and admin
      const mockContext = createMockContext(UserRole.ADMIN);
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([UserRole.TEACHER, UserRole.ADMIN]);

      // Execute
      const result = guard.canActivate(mockContext);

      // Verify
      expect(result).toBe(true);
    });
  });

  // Helper function to create mock execution context
  function createMockContext(
    userRole: UserRole | null,
  ): ExecutionContext {
    const user = userRole
      ? {
          userId: 'test-user-id',
          email: 'test@example.com',
          role: userRole,
        }
      : null;

    const mockRequest = { user };
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  }
});
