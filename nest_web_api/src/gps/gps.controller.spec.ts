import { Test, TestingModule } from '@nestjs/testing';
import { GpsService } from './gps.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GpsLocation } from '../entities/gps.entity';

// Mock repository — simulates TypeORM without hitting the DB
const mockGpsRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};

/**
 * Controller tests would normally go here; however the current file
 * mirrors the service tests and ensures mocked repository behaviour.
 */
describe('GpsService', () => {
  let service: GpsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GpsService,
        {
          provide: getRepositoryToken(GpsLocation),
          useValue: mockGpsRepository,
        },
      ],
    }).compile();

    service = module.get<GpsService>(GpsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveLocation', () => {
    it('should create and save a gps location', async () => {
      const dto = { Tracker_ID: 1, lat: 55.123, lng: 9.456 };
      const created = { ID: 1, tracker: { Tracker_ID: 1 }, lat: 55.123, lng: 9.456, Timestamp: new Date() };

      mockGpsRepository.create.mockReturnValue(created);
      mockGpsRepository.save.mockResolvedValue(created);

      const result = await service.saveLocation(dto);

      expect(mockGpsRepository.create).toHaveBeenCalledWith({
        tracker: { Tracker_ID: dto.Tracker_ID },
        lat: dto.lat,
        lng: dto.lng,
      });
      expect(mockGpsRepository.save).toHaveBeenCalledWith(created);
      expect(result).toEqual(created);
    });
  });

  describe('getLatestByTracker', () => {
    it('should return the latest location for a tracker', async () => {
      const location = { ID: 1, tracker: { Tracker_ID: 1 }, lat: 55.123, lng: 9.456 };
      mockGpsRepository.findOne.mockResolvedValue(location);

      const result = await service.getLatestByTracker(1);

      expect(mockGpsRepository.findOne).toHaveBeenCalledWith({
        where: { tracker: { Tracker_ID: 1 } },
        order: { Timestamp: 'DESC' },
        relations: ['tracker'],
      });
      expect(result).toEqual(location);
    });

    it('should return null if no location found', async () => {
      mockGpsRepository.findOne.mockResolvedValue(null);
      const result = await service.getLatestByTracker(999);
      expect(result).toBeNull();
    });
  });

  describe('get5LatestsByTracker', () => {
    it('should return the 5 latest locations for a tracker', async () => {
      const locations = [
        { ID: 1, tracker: { Tracker_ID: 1 }, lat: 55.123, lng: 9.456 },
        { ID: 2, tracker: { Tracker_ID: 1 }, lat: 55.456, lng: 9.789 },
      ];
      mockGpsRepository.find.mockResolvedValue(locations);

      const result = await service.get5LatestsByTracker(1);

      expect(mockGpsRepository.find).toHaveBeenCalledWith({
        where: { tracker: { Tracker_ID: 1 } },
        order: { Timestamp: 'DESC' },
        take: 5,
        relations: ['tracker'],
      });
      expect(result).toEqual(locations);
    });
  });
});