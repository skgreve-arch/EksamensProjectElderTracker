import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GpsService } from './gps.service';
import { GpsLocation } from '../entities/gps.entity';

@Controller('gps')
export class GpsController 
{
  constructor(private readonly gpsService: GpsService) {}

  // GET /gps/:trackerId/latest
  @Get(':trackerId/latest')
  getLatest(@Param('trackerId', ParseIntPipe) trackerId: number): Promise<GpsLocation | null> 
  {
    return this.gpsService.getLatestByTracker(trackerId);
  }

  // GET /gps/:trackerId/latest5
  @Get(':trackerId/latest5')
  getLatest5(@Param('trackerId', ParseIntPipe) trackerId: number): Promise<GpsLocation[]> 
  {
    return this.gpsService.get5LatestsByTracker(trackerId);
  }
}