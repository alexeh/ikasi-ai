import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesController } from '../src/modules/exercises/exercises.controller';
import { ExercisesService } from '../src/modules/exercises/exercises.service';
import { RolesGuard } from '../src/modules/auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../src/modules/users/users.entity';

describe('ExercisesController', () => {
  let controller: ExercisesController;

  const mockExercisesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExercisesController],
      providers: [
        {
          provide: ExercisesService,
          useValue: mockExercisesService,
        },
        RolesGuard,
        Reflector,
      ],
    }).compile();

    controller = module.get<ExercisesController>(ExercisesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Role-based access control', () => {
    it('should have RolesGuard applied', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const guards = Reflect.getMetadata('__guards__', ExercisesController);
      expect(guards).toBeDefined();
    });

    it('should require TEACHER role', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const roles = Reflect.getMetadata('roles', ExercisesController);
      expect(roles).toContain(UserRole.TEACHER);
    });
  });

  describe('findAll', () => {
    it('should return an array of exercises', async () => {
      const result = [{ id: '1', title: 'Test Exercise' }];
      mockExercisesService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(mockExercisesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single exercise', async () => {
      const result = { id: '1', title: 'Test Exercise' };
      mockExercisesService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(mockExercisesService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new exercise', async () => {
      const dto = { title: 'New Exercise' };
      const result = { id: '1', ...dto };
      mockExercisesService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toBe(result);
      expect(mockExercisesService.create).toHaveBeenCalledWith(dto);
    });
  });
});
