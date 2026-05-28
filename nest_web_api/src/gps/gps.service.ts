import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GpsLocation } from '../entities/gps.entity';
import { GpsLocationDto } from '../dto/gps.dto';

@Injectable()
export class GpsService 
{
  constructor(
    @InjectRepository(GpsLocation)
    private readonly gpsRepository: Repository<GpsLocation>,
  ) {}

  /**
   * Saves a new GPS location.
   * @param dto 
   * @returns 
   */
  async saveLocation(dto: GpsLocationDto): Promise<GpsLocation> 
  {
    const location = this.gpsRepository.create({
      tracker: { Tracker_ID: dto.Tracker_ID },
      lat: dto.lat,
      lng: dto.lng,
    });
    return this.gpsRepository.save(location);
  }

  /**
   * Retrieves the latest GPS location for a given tracker ID.
   * @param trackerId 
   * @returns 
   */
  async getLatestByTracker(trackerId: number): Promise<GpsLocation | null> 
  {
    return this.gpsRepository.findOne({
      where: { tracker: { Tracker_ID: trackerId } },
      order: { Timestamp: 'DESC' },
      relations: ['tracker'],
    });
  }

  /**
   * Retrieves the 5 latest GPS locations for a given tracker ID.
   * @param trackerId 
   * @returns 
   */
  async get5LatestsByTracker(trackerId: number): Promise<GpsLocation[]> 
  {
    return this.gpsRepository.find({
      where: { tracker: { Tracker_ID: trackerId } },
      order: { Timestamp: 'DESC' },
      take: 5,
      relations: ['tracker'],
    });
  }
}