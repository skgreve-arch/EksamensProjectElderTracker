import { Test, TestingModule } from '@nestjs/testing';
import { TrackersController } from './trackers.controller';
import { TrackersService } from './trackers.service';

const mockTrackersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findUnassigned: jest.fn(),
};

describe('TrackersController', () => {
  let controller: TrackersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackersController],
      providers: [{ provide: TrackersService, useValue: mockTrackersService }],
    }).compile();

    controller = module.get<TrackersController>(TrackersController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a tracker', async () => {
      const dto = { IP: '192.168.1.1', Port: 8000 };
      const created = { Tracker_ID: 1, ...dto, IsOnline: false, Battery: null };

      mockTrackersService.create.mockResolvedValue(created);

      const result = await controller.create(dto);

      expect(mockTrackersService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('should return all trackers', async () => {
      const trackers = [
        { Tracker_ID: 1, IP: '192.168.1.1', Port: 8000, IsOnline: true, Battery: 80 },
        { Tracker_ID: 2, IP: '192.168.1.2', Port: 8000, IsOnline: false, Battery: 50 },
      ];
      mockTrackersService.findAll.mockResolvedValue(trackers);

      const result = await controller.findAll();

      expect(mockTrackersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(trackers);
    });

    it('should return empty array if no trackers', async () => {
      mockTrackersService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a tracker by id', async () => {
      const tracker = { Tracker_ID: 1, IP: '192.168.1.1', Port: 8000, IsOnline: true, Battery: 80 };
      mockTrackersService.findOne.mockResolvedValue(tracker);

      const result = await controller.findOne(1);

      expect(mockTrackersService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(tracker);
    });

    it('should return null if tracker not found', async () => {
      mockTrackersService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return the tracker', async () => {
      const dto = { IsOnline: true, Battery: 75 };
      const updated = { Tracker_ID: 1, IP: '192.168.1.1', Port: 8000, ...dto };

      mockTrackersService.update.mockResolvedValue(updated);

      const result = await controller.update(1, dto);

      expect(mockTrackersService.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete a tracker', async () => {
      mockTrackersService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(mockTrackersService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('findUnassigned', () => {
    it('should return all trackers without a resident', async () => {
      const trackers = [
        { Tracker_ID: 2, IP: '192.168.1.2', IsOnline: false, Battery: 50 },
      ];
      mockTrackersService.findUnassigned.mockResolvedValue(trackers);

      const result = await controller.findUnassigned();

      expect(mockTrackersService.findUnassigned).toHaveBeenCalled();
      expect(result).toEqual(trackers);
    });

    it('should return empty array if no unassigned trackers', async () => {
      mockTrackersService.findUnassigned.mockResolvedValue([]);

      const result = await controller.findUnassigned();

      expect(result).toEqual([]);
    });
  });
});