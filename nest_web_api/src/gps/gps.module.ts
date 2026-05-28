import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GpsLocation } from '../entities/gps.entity';
import { GpsService } from './gps.service';
import { GpsController } from './gps.controller';
import { Tracker } from 'src/entities/tracker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GpsLocation, Tracker])],
  providers: [GpsService],
  controllers: [GpsController],
  exports: [GpsService],
})
export class GpsModule { }