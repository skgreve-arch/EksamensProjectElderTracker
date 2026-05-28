import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resident } from '../entities/resident.entity';
import { ResidentsService } from './residents.service';
import { ResidentsController } from './residents.controller';
import { TrackersModule } from 'src/trackers/trackers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Resident]), TrackersModule],
  providers: [ResidentsService],
  controllers: [ResidentsController],
  exports: [ResidentsService],
})
export class ResidentsModule {}