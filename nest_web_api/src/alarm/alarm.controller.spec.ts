import { Test, TestingModule } from '@nestjs/testing';
import { AlarmController } from './alarm.controller';
import { AlarmService } from './alarm.service';

const mockAlarmService = {
  findAll: jest.fn(),
  findByTracker: jest.fn(),
};

describe('AlarmController', () => {
  let controller: AlarmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlarmController],
      providers: [{ provide: AlarmService, useValue: mockAlarmService }],
    }).compile();

    controller = module.get<AlarmController>(AlarmController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all alarms', async () => {
      const alarms = [
        { Alarm_ID: 1, tracker: { Tracker_ID: 1 }, Timestamp: new Date() },
        { Alarm_ID: 2, tracker: { Tracker_ID: 2 }, Timestamp: new Date() },
      ];
      mockAlarmService.findAll.mockResolvedValue(alarms);

      const result = await controller.findAll();

      expect(mockAlarmService.findAll).toHaveBeenCalled();
      expect(result).toEqual(alarms);
    });

    it('should return empty array if no alarms', async () => {
      mockAlarmService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findByTracker', () => {
    it('should return all alarms for a specific tracker', async () => {
      const alarms = [
        { Alarm_ID: 1, tracker: { Tracker_ID: 1 }, Timestamp: new Date() },
      ];
      mockAlarmService.findByTracker.mockResolvedValue(alarms);

      const result = await controller.findByTracker(1);

      expect(mockAlarmService.findByTracker).toHaveBeenCalledWith(1);
      expect(result).toEqual(alarms);
    });

    it('should return empty array if no alarms for tracker', async () => {
      mockAlarmService.findByTracker.mockResolvedValue([]);

      const result = await controller.findByTracker(999);

      expect(mockAlarmService.findByTracker).toHaveBeenCalledWith(999);
      expect(result).toEqual([]);
    });
  });
});