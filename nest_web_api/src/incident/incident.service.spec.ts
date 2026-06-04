import { Test, TestingModule } from '@nestjs/testing';
import { IncidentService } from './incident.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IncidentReport } from '../entities/incident.entity';

const mockIncidentRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('IncidentService', () => {
  let service: IncidentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentService,
        {
          provide: getRepositoryToken(IncidentReport),
          useValue: mockIncidentRepository,
        },
      ],
    }).compile();

    service = module.get<IncidentService>(IncidentService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save an incident report', async () => {
      const dto = { Resident_ID: 1, User_ID: 1, Title: 'Test Incident Title', Description: 'Test incident description' };
      const created = {
        ID: 1,
        resident: { Resident_ID: 1 },
        respondedBy: { User_ID: 1 },
        Title: 'Test Incident Title',
        Description: 'Test incident description',
        Date: new Date(),
      };

      mockIncidentRepository.create.mockReturnValue(created);
      mockIncidentRepository.save.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(mockIncidentRepository.create).toHaveBeenCalledWith({
        resident: { Resident_ID: 1 },
        respondedBy: { User_ID: 1 },
        Title: dto.Title,
        Description: dto.Description,
      });
      expect(mockIncidentRepository.save).toHaveBeenCalledWith(created);
      expect(result).toEqual(created);
    });

    it('should create an incident report without description', async () => {
      const dto = { Resident_ID: 1, User_ID: 1, Title: 'Test Incident Title' };
      const created = {
        ID: 1,
        resident: { Resident_ID: 1 },
        respondedBy: { User_ID: 1 },
        Title: 'Test Incident Title',
        Description: undefined,
        Date: new Date(),
      };

      mockIncidentRepository.create.mockReturnValue(created);
      mockIncidentRepository.save.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(mockIncidentRepository.create).toHaveBeenCalledWith({
        resident: { Resident_ID: 1 },
        respondedBy: { User_ID: 1 },
        Title: dto.Title,
        Description: undefined,
      });
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('should return all incident reports with relations ordered by date', async () => {
      const reports = [
        { ID: 2, resident: { Resident_ID: 1 }, respondedBy: { User_ID: 1 }, Date: new Date() },
        { ID: 1, resident: { Resident_ID: 1 }, respondedBy: { User_ID: 1 }, Date: new Date() },
      ];
      mockIncidentRepository.find.mockResolvedValue(reports);

      const result = await service.findAll();

      expect(mockIncidentRepository.find).toHaveBeenCalledWith({
        relations: ['resident', 'respondedBy'],
        order: { Date: 'DESC' },
      });
      expect(result).toEqual(reports);
    });

    it('should return empty array if no reports', async () => {
      mockIncidentRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return an incident report by id', async () => {
      const report = {
        ID: 1,
        resident: { Resident_ID: 1 },
        respondedBy: { User_ID: 1 },
        Description: 'Test',
        Date: new Date(),
      };
      mockIncidentRepository.findOne.mockResolvedValue(report);

      const result = await service.findOne(1);

      expect(mockIncidentRepository.findOne).toHaveBeenCalledWith({
        where: { ID: 1 },
        relations: ['resident', 'respondedBy'],
      });
      expect(result).toEqual(report);
    });

    it('should return null if report not found', async () => {
      mockIncidentRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('findByResident', () => {
    it('should return all reports for a resident', async () => {
      const reports = [
        { ID: 1, resident: { Resident_ID: 1 }, respondedBy: { User_ID: 1 }, Date: new Date() },
      ];
      mockIncidentRepository.find.mockResolvedValue(reports);

      const result = await service.findByResident(1);

      expect(mockIncidentRepository.find).toHaveBeenCalledWith({
        where: { resident: { Resident_ID: 1 } },
        relations: ['resident', 'respondedBy'],
        order: { Date: 'DESC' },
      });
      expect(result).toEqual(reports);
    });

    it('should return empty array if no reports for resident', async () => {
      mockIncidentRepository.find.mockResolvedValue([]);

      const result = await service.findByResident(999);

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update description and return the report', async () => {
      const dto = { Title: 'Updated Title', Description: 'Updated description' };
      const updated = {
        ID: 1,
        resident: { Resident_ID: 1 },
        respondedBy: { User_ID: 1 },
        Title: 'Updated Title',
        Description: 'Updated description',
        Date: new Date(),
      };

      mockIncidentRepository.update.mockResolvedValue({ affected: 1 });
      mockIncidentRepository.findOne.mockResolvedValue(updated);

      const result = await service.update(1, dto);

      expect(mockIncidentRepository.update).toHaveBeenCalledWith(1, {
        Title: dto.Title,
        Description: dto.Description,
        respondedBy: undefined,
      });
      expect(result).toEqual(updated);
    });

    it('should update respondedBy and return the report', async () => {
      const dto = { User_ID: 2 };
      const updated = {
        ID: 1,
        resident: { Resident_ID: 1 },
        respondedBy: { User_ID: 2 },
        Date: new Date(),
      };

      mockIncidentRepository.update.mockResolvedValue({ affected: 1 });
      mockIncidentRepository.findOne.mockResolvedValue(updated);

      const result = await service.update(1, dto);

      expect(mockIncidentRepository.update).toHaveBeenCalledWith(1, {
        Description: undefined,
        respondedBy: { User_ID: 2 },
      });
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete an incident report', async () => {
      mockIncidentRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockIncidentRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});