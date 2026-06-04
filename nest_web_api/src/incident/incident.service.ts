import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IncidentReport } from '../entities/incident.entity';
import { CreateIncidentReportDto, UpdateIncidentReportDto } from '../dto/incident.dto';

@Injectable()
export class IncidentService 
{
  constructor(
    @InjectRepository(IncidentReport)
    private readonly incidentRepository: Repository<IncidentReport>,
  ) {}

  async create(dto: CreateIncidentReportDto): Promise<IncidentReport> 
  {
    const report = this.incidentRepository.create({
      resident: { Resident_ID: dto.Resident_ID },
      respondedBy: { User_ID: dto.User_ID },
      Title: dto.Title,
      Description: dto.Description,
    });
    return this.incidentRepository.save(report);
  }

  async findAll(): Promise<IncidentReport[]> 
  {
    return this.incidentRepository.find({
      relations: ['resident', 'respondedBy'],
      order: { Date: 'DESC' },
    });
  }

  async findOne(id: number): Promise<IncidentReport | null> 
  {
    return this.incidentRepository.findOne({
      where: { ID: id },
      relations: ['resident', 'respondedBy'],
    });
  }

  async findByResident(residentId: number): Promise<IncidentReport[]> 
  {
    return this.incidentRepository.find({
      where: { resident: { Resident_ID: residentId } },
      relations: ['resident', 'respondedBy'],
      order: { Date: 'DESC' },
    });
  }

  async update(id: number, dto: UpdateIncidentReportDto): Promise<IncidentReport | null> 
  {
    await this.incidentRepository.update(id, {
      Title: dto.Title,
      Description: dto.Description,
      respondedBy: dto.User_ID ? { User_ID: dto.User_ID } : undefined,
    });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> 
  {
    await this.incidentRepository.delete(id);
  }
}