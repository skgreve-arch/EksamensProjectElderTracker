import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GpsService } from './gps.service';
import { GpsLocation } from '../entities/gps.entity';

/**
 * Controller exposing GPS endpoints consumed by the frontend or other
 * services. Endpoints return the latest GPS points for a tracker.
 */
@Controller('gps')
export class GpsController {
  constructor(private readonly gpsService: GpsService) {}

  // GET /gps/:trackerId/latest
  @Get(':trackerId/latest')
  getLatest(@Param('trackerId', ParseIntPipe) trackerId: number): Promise<GpsLocation | null> {
    // ParseIntPipe ensures the parameter is converted to a number.
    return this.gpsService.getLatestByTracker(trackerId);
  }

  // GET /gps/:trackerId/latest5
  @Get(':trackerId/latest5')
  getLatest5(@Param('trackerId', ParseIntPipe) trackerId: number): Promise<GpsLocation[]> {
    return this.gpsService.get5LatestsByTracker(trackerId);
  }
}