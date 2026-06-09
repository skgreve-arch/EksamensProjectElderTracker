import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alarm } from '../entities/alarm.entity';

/**
 * Service responsible for creating and querying alarm records.
 *
 * Uses a TypeORM repository for `Alarm` entities to persist and
 * retrieve alarm events associated with trackers.
 */
@Injectable()
export class AlarmService {
  constructor(
    @InjectRepository(Alarm)
    private readonly alarmRepository: Repository<Alarm>,
  ) { }

  /**
   * Trigger a new alarm for a tracker by creating and saving an Alarm
   * entity that references the tracker by its numeric ID.
   *
   * The repository `create` call builds the entity instance and
   * `save` persists it, returning the saved record including any
   * generated columns (e.g. primary key, timestamps).
   */
  async triggerAlarm(trackerId: number): Promise<Alarm> {
    const alarm = this.alarmRepository.create({
      tracker: { Tracker_ID: trackerId },
    });
    return this.alarmRepository.save(alarm);
  }

  /**
   * Retrieve all alarms along with their tracker relation, ordered
   * by `Timestamp` descending so the most recent alarms appear first.
   */
  async findAll(): Promise<Alarm[]> {
    return this.alarmRepository.find({
      relations: ['tracker'],
      order: { Timestamp: 'DESC' },
    });
  }

  /**
   * Retrieve alarms filtered by a specific tracker ID. Returns the
   * results with the tracker relation loaded and ordered by newest first.
   */
  async findByTracker(trackerId: number): Promise<Alarm[]> {
    return this.alarmRepository.find({
      where: { tracker: { Tracker_ID: trackerId } },
      relations: ['tracker'],
      order: { Timestamp: 'DESC' },
    });
  }
}