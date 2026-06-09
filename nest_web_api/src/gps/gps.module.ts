import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GpsLocation } from '../entities/gps.entity';
import { GpsService } from './gps.service';
import { GpsController } from './gps.controller';
import { Tracker } from 'src/entities/tracker.entity';

/**
 * Module that wires up GPS-related components. Exposes `GpsService`
 * for use by other modules and registers the `GpsLocation` and
 * `Tracker` entities with TypeORM.
 */
@Module({
  imports: [TypeOrmModule.forFeature([GpsLocation, Tracker])],
  providers: [GpsService],
  controllers: [GpsController],
  exports: [GpsService],
})
export class GpsModule {}