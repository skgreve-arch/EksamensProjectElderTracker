import { Module } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { IncidentReport } from 'src/entities/incident.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([IncidentReport])],
  providers: [IncidentService],
  exports: [IncidentService],
})
export class IncidentModule {}
