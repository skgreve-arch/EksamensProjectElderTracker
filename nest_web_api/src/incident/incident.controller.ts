import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { CreateIncidentReportDto, UpdateIncidentReportDto } from '../dto/incident.dto';
import { IncidentReport } from '../entities/incident.entity';

/**
 * HTTP controller for incident reports.
 *
 * Routes:
 * - POST /incident -> create a new report
 * - GET /incident -> list all reports
 * - GET /incident/:id -> get a single report
 * - GET /incident/resident/:residentId -> reports for a resident
 * - PATCH /incident/:id -> update a report
 * - DELETE /incident/:id -> delete a report
 */
@Controller('incident')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  // POST /incident
  @Post()
  create(@Body() dto: CreateIncidentReportDto): Promise<IncidentReport> {
    return this.incidentService.create(dto);
  }

  // GET /incident
  @Get()
  findAll(): Promise<IncidentReport[]> {
    return this.incidentService.findAll();
  }

  // GET /incident/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<IncidentReport | null> {
    return this.incidentService.findOne(id);
  }

  // GET /incident/resident/:residentId
  @Get('resident/:residentId')
  findByResident(@Param('residentId', ParseIntPipe) residentId: number): Promise<IncidentReport[]> {
    return this.incidentService.findByResident(residentId);
  }

  // PATCH /incident/:id
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateIncidentReportDto,
  ): Promise<IncidentReport | null> {
    return this.incidentService.update(id, dto);
  }

  // DELETE /incident/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.incidentService.remove(id);
  }
}