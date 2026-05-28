import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { Alarm } from '../entities/alarm.entity';

@Controller('alarm')
export class AlarmController 
{
  constructor(private readonly alarmService: AlarmService) {}

  // GET /alarm
  @Get()
  findAll(): Promise<Alarm[]> 
  {
    return this.alarmService.findAll();
  }

  // GET /alarm/tracker/:trackerId
  @Get('tracker/:trackerId')
  findByTracker(@Param('trackerId', ParseIntPipe) trackerId: number): Promise<Alarm[]> 
  {
    return this.alarmService.findByTracker(trackerId);
  }
}