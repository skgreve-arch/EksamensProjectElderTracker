import { Test, TestingModule } from '@nestjs/testing';
import { TrackersService } from './trackers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tracker } from '../entities/tracker.entity';

const mockTrackerRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(),
};

describe('TrackersService', () => {
  let service: TrackersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackersService,
        {
          provide: getRepositoryToken(Tracker),
          useValue: mockTrackerRepository,
        },
      ],
    }).compile();

    service = module.get<TrackersService>(TrackersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a tracker', async () => {
      const dto = { IP: '192.168.1.1', Port: 8000 };
      const created = { Tracker_ID: 1, ...dto, IsOnline: false, Battery: null };

      mockTrackerRepository.create.mockReturnValue(created);
      mockTrackerRepository.save.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(mockTrackerRepository.create).toHaveBeenCalledWith({
        ...dto,
        IsOnline: false,
      });
      expect(mockTrackerRepository.save).toHaveBeenCalledWith(created);
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('should return all trackers', async () => {
      const trackers = [
        { Tracker_ID: 1, IP: '192.168.1.1', Port: 8000, IsOnline: true, Battery: 80 },
        { Tracker_ID: 2, IP: '192.168.1.2', Port: 8000, IsOnline: false, Battery: 50 },
      ];
      mockTrackerRepository.find.mockResolvedValue(trackers);

      const result = await service.findAll();

      expect(mockTrackerRepository.find).toHaveBeenCalled();
      expect(result).toEqual(trackers);
    });

    it('should return empty array if no trackers found', async () => {
      mockTrackerRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a tracker by id', async () => {
      const tracker = { Tracker_ID: 1, IP: '192.168.1.1', Port: 8000, IsOnline: true, Battery: 80 };
      mockTrackerRepository.findOne.mockResolvedValue(tracker);

      const result = await service.findOne(1);

      expect(mockTrackerRepository.findOne).toHaveBeenCalledWith({
        where: { Tracker_ID: 1 },
      });
      expect(result).toEqual(tracker);
    });

    it('should return null if tracker not found', async () => {
      mockTrackerRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return the tracker', async () => {
      const dto = { IsOnline: true, Battery: 75 };
      const updated = { Tracker_ID: 1, IP: '192.168.1.1', Port: 8000, ...dto };

      mockTrackerRepository.update.mockResolvedValue({ affected: 1 });
      mockTrackerRepository.findOne.mockResolvedValue(updated);

      const result = await service.update(1, dto);

      expect(mockTrackerRepository.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(updated);
    });
  });

  describe('setOnlineStatus', () => {
    it('should set tracker online status to true', async () => {
      const updated = { Tracker_ID: 1, IP: '192.168.1.1', Port: 8000, IsOnline: true, Battery: 80 };

      mockTrackerRepository.update.mockResolvedValue({ affected: 1 });
      mockTrackerRepository.findOne.mockResolvedValue(updated);

      const result = await service.setOnlineStatus(1, true);

      expect(mockTrackerRepository.update).toHaveBeenCalledWith(1, { IsOnline: true });
      expect(result!.IsOnline).toBe(true);
    });

    it('should set tracker online status to false', async () => {
      const updated = { Tracker_ID: 1, IP: '192.168.1.1', Port: 8000, IsOnline: false, Battery: 80 };

      mockTrackerRepository.update.mockResolvedValue({ affected: 1 });
      mockTrackerRepository.findOne.mockResolvedValue(updated);

      const result = await service.setOnlineStatus(1, false);

      expect(mockTrackerRepository.update).toHaveBeenCalledWith(1, { IsOnline: false });
      expect(result!.IsOnline).toBe(false);
    });
  });

  describe('updateBattery', () => {
    it('should update battery level', async () => {
      const updated = { Tracker_ID: 1, IP: '192.168.1.1', Port: 8000, IsOnline: true, Battery: 42 };

      mockTrackerRepository.update.mockResolvedValue({ affected: 1 });
      mockTrackerRepository.findOne.mockResolvedValue(updated);

      const result = await service.updateBattery(1, 42);

      expect(mockTrackerRepository.update).toHaveBeenCalledWith(1, { Battery: 42 });
      expect(result!.Battery).toBe(42);
    });
  });

  describe('remove', () => {
    it('should delete a tracker', async () => {
      mockTrackerRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockTrackerRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('findUnassigned', () => {
    it('should return all trackers without a resident', async () => {
      const trackers = [
        { Tracker_ID: 2, IP: '192.168.1.2', IsOnline: false, Battery: 50 },
      ];

      const mockQueryBuilder = 
      {
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(trackers),
      };

      mockTrackerRepository.createQueryBuilder = jest.fn().mockReturnValue(mockQueryBuilder);

      const result = await service.findUnassigned();

      expect(mockTrackerRepository.createQueryBuilder).toHaveBeenCalledWith('tracker');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('tracker.resident', 'resident');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('resident.Resident_ID IS NULL');
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual(trackers);
    });
  });

  describe('updateLastSeen', () => {
    it('should update LastSeen and return the tracker', async () => {
      const updated = { Tracker_ID: 1, IP: '192.168.1.1', IsOnline: true, LastSeen: new Date() };

      mockTrackerRepository.update.mockResolvedValue({ affected: 1 });
      mockTrackerRepository.findOne.mockResolvedValue(updated);

      const result = await service.updateLastSeen(1);

      expect(mockTrackerRepository.update).toHaveBeenCalledWith(1, {
        LastSeen: expect.any(Date),
      });
      expect(result).toEqual(updated);
    });

    it('should return null if tracker not found', async () => {
      mockTrackerRepository.update.mockResolvedValue({ affected: 0 });
      mockTrackerRepository.findOne.mockResolvedValue(null);

      const result = await service.updateLastSeen(999);

      expect(result).toBeNull();
    });
  });

  describe('updateOfflineTrackers', () => {
    it('should set tracker offline if LastSeen is null', async () => {
      const tracker = { Tracker_ID: 1, IP: '192.168.1.1', IsOnline: true, LastSeen: null };
      mockTrackerRepository.find.mockResolvedValue([tracker]);
      mockTrackerRepository.save.mockResolvedValue({ ...tracker, IsOnline: false });

      await service.updateOfflineTrackers();

      expect(mockTrackerRepository.save).toHaveBeenCalledWith({
        ...tracker,
        IsOnline: false,
      });
    });

    it('should set tracker offline if LastSeen is more than 60 seconds ago', async () => {
      const oldDate = new Date(Date.now() - 120000); // 2 minutes ago
      const tracker = { Tracker_ID: 1, IP: '192.168.1.1', IsOnline: true, LastSeen: oldDate };
      mockTrackerRepository.find.mockResolvedValue([tracker]);
      mockTrackerRepository.save.mockResolvedValue({ ...tracker, IsOnline: false });

      await service.updateOfflineTrackers();

      expect(mockTrackerRepository.save).toHaveBeenCalledWith({
        ...tracker,
        IsOnline: false,
      });
    });

    it('should not set tracker offline if LastSeen is within 60 seconds', async () => {
      const recentDate = new Date(Date.now() - 30000); // 30 seconds ago
      const tracker = { Tracker_ID: 1, IP: '192.168.1.1', IsOnline: true, LastSeen: recentDate };
      mockTrackerRepository.find.mockResolvedValue([tracker]);

      await service.updateOfflineTrackers();

      expect(mockTrackerRepository.save).not.toHaveBeenCalled();
    });

    it('should handle empty tracker list', async () => {
      mockTrackerRepository.find.mockResolvedValue([]);

      await service.updateOfflineTrackers();

      expect(mockTrackerRepository.save).not.toHaveBeenCalled();
    });
  });
});