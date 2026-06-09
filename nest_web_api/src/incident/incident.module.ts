import { Module } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { IncidentReport } from 'src/entities/incident.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentController } from './incident.controller';

/**
 * IncidentModule wires up the incident report domain: controller,
 * service and the IncidentReport entity repository.
 */
@Module({
  imports: [TypeOrmModule.forFeature([IncidentReport])],
  providers: [IncidentService],
  exports: [IncidentService],
  controllers: [IncidentController],
})
export class IncidentModule {}
