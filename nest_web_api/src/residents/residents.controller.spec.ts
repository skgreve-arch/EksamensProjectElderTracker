import { Test, TestingModule } from '@nestjs/testing';
import { ResidentsController } from './residents.controller';
import { ResidentsService } from './residents.service';

const mockResidentsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByTracker: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

/**
 * Controller unit tests for `ResidentsController` ensuring delegation to
 * `ResidentsService` and expected route behavior.
 */
describe('ResidentsController', () => {
  let controller: ResidentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResidentsController],
      providers: [{ provide: ResidentsService, useValue: mockResidentsService }],
    }).compile();

    controller = module.get<ResidentsController>(ResidentsController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a resident', async () => {
      const dto = { Name: 'John Doe', Address: '123 Main St', Tracker_ID: 1 };
      const created = { Resident_ID: 1, ...dto, tracker: { Tracker_ID: 1 } };

      mockResidentsService.create.mockResolvedValue(created);

      const result = await controller.create(dto);

      expect(mockResidentsService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('should return all residents', async () => {
      const residents = [
        { Resident_ID: 1, Name: 'John Doe', tracker: { Tracker_ID: 1 } },
        { Resident_ID: 2, Name: 'Jane Doe', tracker: null },
      ];
      mockResidentsService.findAll.mockResolvedValue(residents);

      const result = await controller.findAll();

      expect(mockResidentsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(residents);
    });

    it('should return empty array if no residents', async () => {
      mockResidentsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a resident by id', async () => {
      const resident = { Resident_ID: 1, Name: 'John Doe', tracker: { Tracker_ID: 1 } };
      mockResidentsService.findOne.mockResolvedValue(resident);

      const result = await controller.findOne(1);

      expect(mockResidentsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(resident);
    });

    it('should return null if resident not found', async () => {
      mockResidentsService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('findByTracker', () => {
    it('should return a resident by tracker id', async () => {
      const resident = { Resident_ID: 1, Name: 'John Doe', tracker: { Tracker_ID: 1 } };
      mockResidentsService.findByTracker.mockResolvedValue(resident);

      const result = await controller.findByTracker(1);

      expect(mockResidentsService.findByTracker).toHaveBeenCalledWith(1);
      expect(result).toEqual(resident);
    });

    it('should return null if no resident assigned to tracker', async () => {
      mockResidentsService.findByTracker.mockResolvedValue(null);

      const result = await controller.findByTracker(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return the resident', async () => {
      const dto = { Name: 'Updated Name' };
      const updated = { Resident_ID: 1, Name: 'Updated Name', tracker: { Tracker_ID: 1 } };

      mockResidentsService.update.mockResolvedValue(updated);

      const result = await controller.update(1, dto);

      expect(mockResidentsService.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete a resident', async () => {
      mockResidentsService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(mockResidentsService.remove).toHaveBeenCalledWith(1);
    });
  });
});