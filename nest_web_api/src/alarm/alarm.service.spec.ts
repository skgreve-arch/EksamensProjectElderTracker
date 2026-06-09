import { Test, TestingModule } from '@nestjs/testing';
import { AlarmService } from './alarm.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Alarm } from '../entities/alarm.entity';

// Minimal mock repository that exposes the methods used by AlarmService.
const mockAlarmRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
};

/**
 * Unit tests for `AlarmService` verify the repository interactions and
 * the returned values for `triggerAlarm`, `findAll`, and `findByTracker`.
 */
describe('AlarmService', () => {
  let service: AlarmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlarmService,
        {
          provide: getRepositoryToken(Alarm),
          useValue: mockAlarmRepository,
        },
      ],
    }).compile();

    service = module.get<AlarmService>(AlarmService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('triggerAlarm', () => {
    it('should create and save an alarm for a tracker', async () => {
      const alarm = { Alarm_ID: 1, tracker: { Tracker_ID: 1 }, Timestamp: new Date() };

      // Repository returns the created entity and resolves when saved.
      mockAlarmRepository.create.mockReturnValue(alarm);
      mockAlarmRepository.save.mockResolvedValue(alarm);

      const result = await service.triggerAlarm(1);

      expect(mockAlarmRepository.create).toHaveBeenCalledWith({
        tracker: { Tracker_ID: 1 },
      });
      expect(mockAlarmRepository.save).toHaveBeenCalledWith(alarm);
      expect(result).toEqual(alarm);
    });
  });

  describe('findAll', () => {
    it('should return all alarms with trackers ordered by timestamp', async () => {
      const alarms = [
        { Alarm_ID: 2, tracker: { Tracker_ID: 1 }, Timestamp: new Date() },
        { Alarm_ID: 1, tracker: { Tracker_ID: 1 }, Timestamp: new Date() },
      ];
      mockAlarmRepository.find.mockResolvedValue(alarms);

      const result = await service.findAll();

      expect(mockAlarmRepository.find).toHaveBeenCalledWith({
        relations: ['tracker'],
        order: { Timestamp: 'DESC' },
      });
      expect(result).toEqual(alarms);
    });

    it('should return empty array if no alarms', async () => {
      mockAlarmRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findByTracker', () => {
    it('should return all alarms for a specific tracker', async () => {
      const alarms = [
        { Alarm_ID: 1, tracker: { Tracker_ID: 1 }, Timestamp: new Date() },
      ];
      mockAlarmRepository.find.mockResolvedValue(alarms);

      const result = await service.findByTracker(1);

      expect(mockAlarmRepository.find).toHaveBeenCalledWith({
        where: { tracker: { Tracker_ID: 1 } },
        relations: ['tracker'],
        order: { Timestamp: 'DESC' },
      });
      expect(result).toEqual(alarms);
    });

    it('should return empty array if no alarms for tracker', async () => {
      mockAlarmRepository.find.mockResolvedValue([]);

      const result = await service.findByTracker(999);

      expect(result).toEqual([]);
    });
  });
});