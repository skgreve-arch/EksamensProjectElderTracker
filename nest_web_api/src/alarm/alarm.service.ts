import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alarm } from '../entities/alarm.entity';

@Injectable()
export class AlarmService 
{
  constructor(
    @InjectRepository(Alarm)
    private readonly alarmRepository: Repository<Alarm>,
  ) {}

  /**
   * Triggers an alarm for the specified tracker defined by trackerId. Creates a new alarm entry in the database with the current timestamp.
   * @param trackerId 
   * @returns 
   */
  async triggerAlarm(trackerId: number): Promise<Alarm> 
  {
    const alarm = this.alarmRepository.create({
      tracker: { Tracker_ID: trackerId },
    });
    return this.alarmRepository.save(alarm);
  }

  /**
   * Finds all alarm entries in the database, ordered by timestamp in descending order.
   * @returns 
   */
  async findAll(): Promise<Alarm[]> 
  {
    return this.alarmRepository.find({
      relations: ['tracker'],
      order: { Timestamp: 'DESC' },
    });
  }

  /**
   * Finds all alarm entries for the specified tracker, ordered by timestamp in descending order.
   * @param trackerId 
   * @returns 
   */
  async findByTracker(trackerId: number): Promise<Alarm[]> 
  {
    return this.alarmRepository.find({
      where: { tracker: { Tracker_ID: trackerId } },
      relations: ['tracker'],
      order: { Timestamp: 'DESC' },
    });
  }
}