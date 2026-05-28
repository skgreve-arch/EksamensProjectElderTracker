import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsocketGateway } from './websocket.gateway';
import { GpsModule } from '../gps/gps.module';
import { TrackersModule } from 'src/trackers/trackers.module';
import { AlarmModule } from 'src/alarm/alarm.module';

@Module({
  imports: [GpsModule, TrackersModule, AlarmModule],
  providers: [WebsocketGateway, Logger],
})
export class WebsocketModule {}