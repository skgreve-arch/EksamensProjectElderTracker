import { Module } from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { AlarmController } from './alarm.controller';
import { Alarm } from '../entities/alarm.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * Module that wires up the Alarm domain: controller, service and TypeORM entity.
 *
 * Importing `TypeOrmModule.forFeature([Alarm])` makes the Alarm repository
 * available for injection in `AlarmService`.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Alarm])],
  providers: [AlarmService],
  controllers: [AlarmController],
  exports: [AlarmService],
})
export class AlarmModule {}
