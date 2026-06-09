import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { Alarm } from '../entities/alarm.entity';

/**
 * HTTP controller exposing Alarm endpoints used by the frontend or other services.
 *
 * Routes:
 * - GET /alarm -> list all alarms
 * - GET /alarm/tracker/:trackerId -> list alarms for a specific tracker
 */
@Controller('alarm')
export class AlarmController {
  constructor(private readonly alarmService: AlarmService) {}

  // GET /alarm
  @Get()
  findAll(): Promise<Alarm[]> {
    // Delegate to service to fetch alarms with their tracker relation.
    return this.alarmService.findAll();
  }

  // GET /alarm/tracker/:trackerId
  @Get('tracker/:trackerId')
  findByTracker(@Param('trackerId', ParseIntPipe) trackerId: number): Promise<Alarm[]> {
    // ParseIntPipe ensures the route parameter is converted to a number.
    return this.alarmService.findByTracker(trackerId);
  }
}