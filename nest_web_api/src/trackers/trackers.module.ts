import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tracker } from '../entities/tracker.entity';
import { TrackersService } from './trackers.service';
import { TrackersController } from './trackers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tracker])],
  providers: [TrackersService],
  controllers: [TrackersController],
  exports: [TrackersService],
})
export class TrackersModule {}