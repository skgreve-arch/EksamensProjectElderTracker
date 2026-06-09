import { Test, TestingModule } from '@nestjs/testing';
import { IncidentController } from './incident.controller';
import { IncidentService } from './incident.service';

const mockIncidentService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByResident: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

/**
 * Unit tests for `IncidentController` ensure the controller delegates to
 * `IncidentService` and returns expected data for each route.
 */
describe('IncidentController', () => {
  let controller: IncidentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncidentController],
      providers: [{ provide: IncidentService, useValue: mockIncidentService }],
    }).compile();

    controller = module.get<IncidentController>(IncidentController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an incident report', async () => {
      const dto = { Resident_ID: 1, User_ID: 1, Title: 'Test Title', Description: 'Test incident' };
      const created = {
        ID: 1,
        resident: { Resident_ID: 1 },
        respondedBy: { User_ID: 1 },
        Title: 'Test Title',
        Description: 'Test incident',
        Date: new Date(),
      };

      mockIncidentService.create.mockResolvedValue(created);

      const result = await controller.create(dto);

      expect(mockIncidentService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('should return all incident reports', async () => {
      const reports = [
        { ID: 1, resident: { Resident_ID: 1 }, respondedBy: { User_ID: 1 }, Title: 'Title 1', Date: new Date() },
        { ID: 2, resident: { Resident_ID: 2 }, respondedBy: { User_ID: 1 }, Title: 'Title 2', Date: new Date() },
      ];
      mockIncidentService.findAll.mockResolvedValue(reports);

      const result = await controller.findAll();

      expect(mockIncidentService.findAll).toHaveBeenCalled();
      expect(result).toEqual(reports);
    });

    it('should return empty array if no reports', async () => {
      mockIncidentService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return an incident report by id', async () => {
      const report = {
        ID: 1,
        resident: { Resident_ID: 1 },
        respondedBy: { User_ID: 1 },
        Title: 'Test Title',
        Date: new Date(),
      };
      mockIncidentService.findOne.mockResolvedValue(report);

      const result = await controller.findOne(1);

      expect(mockIncidentService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(report);
    });

    it('should return null if report not found', async () => {
      mockIncidentService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('findByResident', () => {
    it('should return all reports for a resident', async () => {
      const reports = [
        { ID: 1, resident: { Resident_ID: 1 }, respondedBy: { User_ID: 1 }, Title: 'Test Title', Date: new Date() },
      ];
      mockIncidentService.findByResident.mockResolvedValue(reports);

      const result = await controller.findByResident(1);

      expect(mockIncidentService.findByResident).toHaveBeenCalledWith(1);
      expect(result).toEqual(reports);
    });

    it('should return empty array if no reports for resident', async () => {
      mockIncidentService.findByResident.mockResolvedValue([]);

      const result = await controller.findByResident(999);

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update and return the incident report', async () => {
      const dto = { Title: 'Updated Title', Description: 'Updated description' };
      const updated = {
        ID: 1,
        resident: { Resident_ID: 1 },
        respondedBy: { User_ID: 1 },
        Title: 'Updated Title',
        Description: 'Updated description',
        Date: new Date(),
      };

      mockIncidentService.update.mockResolvedValue(updated);

      const result = await controller.update(1, dto);

      expect(mockIncidentService.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete an incident report', async () => {
      mockIncidentService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(mockIncidentService.remove).toHaveBeenCalledWith(1);
    });
  });
});