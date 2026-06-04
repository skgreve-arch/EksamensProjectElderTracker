import { Module } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { IncidentReport } from 'src/entities/incident.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentController } from './incident.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IncidentReport])],
  providers: [IncidentService],
  exports: [IncidentService],
  controllers: [IncidentController],
})
export class IncidentModule {}
