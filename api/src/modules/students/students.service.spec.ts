import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { StudentsService } from './students.service';
import { Student } from './student.entity';

describe('StudentsService', () => {
  let service: StudentsService;
  let repository: Repository<Student>;

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockRepository = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: getRepositoryToken(Student),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    repository = module.get<Repository<Student>>(getRepositoryToken(Student));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all students without filter', async () => {
      const mockStudents = [
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
      mockQueryBuilder.getMany.mockResolvedValue(mockStudents);

      const result = await service.findAll();

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('student');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'student.user',
        'user',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'student.studentClass',
        'studentClass',
      );
      expect(mockQueryBuilder.where).not.toHaveBeenCalled();
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual(mockStudents);
    });

    it('should return filtered students when classId is provided', async () => {
      const classId = 'class1';
      const mockStudents = [
        {
          id: '1',
          userId: 'user1',
          user: { id: 'user1', name: 'John', email: 'john@test.com' },
          studentClass: { id: 'class1', name: 'Class A' },
        },
      ];
      mockQueryBuilder.getMany.mockResolvedValue(mockStudents);

      const result = await service.findAll(classId);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('student');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'student.user',
        'user',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'student.studentClass',
        'studentClass',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'studentClass.id = :classId',
        { classId },
      );
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual(mockStudents);
    });

    it('should return empty array when no students found', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });
});
