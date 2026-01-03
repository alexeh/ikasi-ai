import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from '../src/modules/students/students.controller';
import { StudentsService } from '../src/modules/students/students.service';
import { RolesGuard } from '../src/modules/auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../src/modules/users/users.entity';

describe('StudentsController', () => {
  let controller: StudentsController;

  const mockStudentsService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: StudentsService,
          useValue: mockStudentsService,
        },
        RolesGuard,
        Reflector,
      ],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Role-based access control', () => {
    it('should have RolesGuard applied', () => {
      const guards = Reflect.getMetadata('__guards__', StudentsController);
      expect(guards).toBeDefined();
    });

    it('should require TEACHER role', () => {
      const roles = Reflect.getMetadata('roles', StudentsController);
      expect(roles).toContain(UserRole.TEACHER);
    });
  });

  describe('findAll', () => {
    it('should return an array of students without filter', async () => {
      const result = [
        {
          id: '1',
          userId: 'user1',
          user: { id: 'user1', name: 'John', email: 'john@test.com' },
          studentClass: { id: 'class1', name: 'Class A' },
        },
        {
          id: '2',
          userId: 'user2',
          user: { id: 'user2', name: 'Jane', email: 'jane@test.com' },
          studentClass: { id: 'class2', name: 'Class B' },
        },
      ];
      mockStudentsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(mockStudentsService.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should return filtered students when classId is provided', async () => {
      const classId = 'class1';
      const result = [
        {
          id: '1',
          userId: 'user1',
          user: { id: 'user1', name: 'John', email: 'john@test.com' },
          studentClass: { id: 'class1', name: 'Class A' },
        },
      ];
      mockStudentsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll(classId)).toBe(result);
      expect(mockStudentsService.findAll).toHaveBeenCalledWith(classId);
    });
  });
});
