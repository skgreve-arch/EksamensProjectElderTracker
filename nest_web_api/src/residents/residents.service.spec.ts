import { Test, TestingModule } from '@nestjs/testing';
import { ResidentsService } from './residents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Resident } from '../entities/resident.entity';
import { TrackersService } from '../trackers/trackers.service';
import { BadRequestException } from '@nestjs/common';

// Mock repository and trackers service used throughout the tests.
const mockResidentRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockTrackersService = {
  findOne: jest.fn(),
};

/**
 * Unit tests for `ResidentsService` verifying create, read, update,
 * delete, and lookup by tracker behaviors.
 */
describe('ResidentsService', () => {
  let service: ResidentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResidentsService,
        {
          provide: getRepositoryToken(Resident),
          useValue: mockResidentRepository,
        },
        {
          provide: TrackersService,
          useValue: mockTrackersService,
        },
      ],
    }).compile();

    service = module.get<ResidentsService>(ResidentsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a resident without a tracker', async () => {
      const dto = { Name: 'John Doe', Address: '123 Main St' };
      const created = { Resident_ID: 1, ...dto, tracker: undefined };

      mockResidentRepository.create.mockReturnValue(created);
      mockResidentRepository.save.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(mockTrackersService.findOne).not.toHaveBeenCalled();
      expect(mockResidentRepository.create).toHaveBeenCalledWith({
        ...dto,
        tracker: undefined,
      });
      expect(result).toEqual(created);
    });

    it('should create a resident with a valid tracker', async () => {
      const dto = { Name: 'John Doe', Tracker_ID: 1 };
      const tracker = { Tracker_ID: 1, IP: '192.168.1.1', IsOnline: true };
      const created = { Resident_ID: 1, ...dto, tracker: { Tracker_ID: 1 } };

      mockTrackersService.findOne.mockResolvedValue(tracker);
      mockResidentRepository.create.mockReturnValue(created);
      mockResidentRepository.save.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(mockTrackersService.findOne).toHaveBeenCalledWith(1);
      expect(mockResidentRepository.create).toHaveBeenCalledWith({
        ...dto,
        tracker: { Tracker_ID: 1 },
      });
      expect(result).toEqual(created);
    });

    it('should throw BadRequestException if tracker does not exist', async () => {
      const dto = { Name: 'John Doe', Tracker_ID: 999 };
      mockTrackersService.findOne.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(mockResidentRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all residents with trackers', async () => {
      const residents = [
        { Resident_ID: 1, Name: 'John Doe', tracker: { Tracker_ID: 1 } },
        { Resident_ID: 2, Name: 'Jane Doe', tracker: null },
      ];
      mockResidentRepository.find.mockResolvedValue(residents);

      const result = await service.findAll();

      expect(mockResidentRepository.find).toHaveBeenCalledWith({ relations: ['tracker'] });
      expect(result).toEqual(residents);
    });

    it('should return empty array if no residents', async () => {
      mockResidentRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a resident by id with tracker', async () => {
      const resident = { Resident_ID: 1, Name: 'John Doe', tracker: { Tracker_ID: 1 } };
      mockResidentRepository.findOne.mockResolvedValue(resident);

      const result = await service.findOne(1);

      expect(mockResidentRepository.findOne).toHaveBeenCalledWith({
        where: { Resident_ID: 1 },
        relations: ['tracker'],
      });
      expect(result).toEqual(resident);
    });

    it('should return null if resident not found', async () => {
      mockResidentRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return the resident', async () => {
      const dto = { Name: 'Updated Name' };
      const updated = { Resident_ID: 1, Name: 'Updated Name', tracker: null };

      mockResidentRepository.update.mockResolvedValue({ affected: 1 });
      mockResidentRepository.findOne.mockResolvedValue(updated);

      const result = await service.update(1, dto);

      expect(mockResidentRepository.update).toHaveBeenCalledWith(1, {
        ...dto,
        tracker: undefined,
      });
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete a resident', async () => {
      mockResidentRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockResidentRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('findByTracker', () => {
    it('should return a resident by tracker id', async () => {
      const resident = { Resident_ID: 1, Name: 'John Doe', tracker: { Tracker_ID: 1 } };
      mockResidentRepository.findOne.mockResolvedValue(resident);

      const result = await service.findByTracker(1);

      expect(mockResidentRepository.findOne).toHaveBeenCalledWith({
        where: { tracker: { Tracker_ID: 1 } },
        relations: ['tracker'],
      });
      expect(result).toEqual(resident);
    });

    it('should return null if no resident assigned to tracker', async () => {
      mockResidentRepository.findOne.mockResolvedValue(null);

      const result = await service.findByTracker(999);

      expect(result).toBeNull();
    });
  });
});