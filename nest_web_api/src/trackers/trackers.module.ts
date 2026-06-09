import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tracker } from '../entities/tracker.entity';
import { TrackersService } from './trackers.service';
import { TrackersController } from './trackers.controller';

/**
 * Registers the `Tracker` repository and wires the trackers controller
 * with the trackers service. Exporting the service allows other modules
 * to depend on tracker-related operations.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Tracker])],
  providers: [TrackersService],
  controllers: [TrackersController],
  exports: [TrackersService],
})
export class TrackersModule {}