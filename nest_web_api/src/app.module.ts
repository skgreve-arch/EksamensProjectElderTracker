import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { GpsModule } from './gps/gps.module';
import { TrackersModule } from './trackers/trackers.module';
import { ResidentsModule } from './residents/residents.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tracker } from './entities/tracker.entity';
import { GpsLocation } from './entities/gps.entity';
import { Resident } from './entities/resident.entity';
import { Alarm } from './entities/alarm.entity';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { WebsocketModule } from './websocket/websocket.module';
import { IncidentReport } from './entities/incident.entity';
import { AlarmModule } from './alarm/alarm.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mssql',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<number>('DB_PORT')?.toString() || '1433'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [Tracker, GpsLocation, Resident, Alarm, User, Role, IncidentReport],
        synchronize: true,
        options: {
          encrypt: true,
          trustServerCertificate: true,
        },
      }),
      inject: [ConfigService],
    }),
    GpsModule, 
    TrackersModule, 
    ResidentsModule, 
    UsersModule, 
    WebsocketModule, AlarmModule, ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
