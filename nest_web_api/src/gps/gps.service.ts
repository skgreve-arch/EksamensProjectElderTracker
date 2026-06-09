import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GpsLocation } from '../entities/gps.entity';
import { GpsLocationDto } from '../dto/gps.dto';

/**
 * Service responsible for persisting and querying GPS locations.
 *
 * Provides methods used by the HTTP controller and other services
 * to save incoming GPS telemetry and fetch the latest points for
 * a given tracker.
 */
@Injectable()
export class GpsService {
  constructor(
    @InjectRepository(GpsLocation)
    private readonly gpsRepository: Repository<GpsLocation>,
  ) {}

  /**
   * Persist a new GPS location using the DTO payload. The repository
   * `create` builds an entity instance and `save` persists it.
   */
  async saveLocation(dto: GpsLocationDto): Promise<GpsLocation> {
    const location = this.gpsRepository.create({
      tracker: { Tracker_ID: dto.Tracker_ID },
      lat: dto.lat,
      lng: dto.lng,
    });
    return this.gpsRepository.save(location);
  }

  /**
   * Return the most recent GPS point for `trackerId`, or `null` if none
   * exist. Results include the `tracker` relation for convenience.
   */
  async getLatestByTracker(trackerId: number): Promise<GpsLocation | null> {
    return this.gpsRepository.findOne({
      where: { tracker: { Tracker_ID: trackerId } },
      order: { Timestamp: 'DESC' },
      relations: ['tracker'],
    });
  }

  /**
   * Return up to 5 of the latest GPS points for `trackerId`, ordered by
   * timestamp descending (newest first). The `take` option limits the
   * result set to 5 rows.
   */
  async get5LatestsByTracker(trackerId: number): Promise<GpsLocation[]> {
    return this.gpsRepository.find({
      where: { tracker: { Tracker_ID: trackerId } },
      order: { Timestamp: 'DESC' },
      take: 5,
      relations: ['tracker'],
    });
  }
}