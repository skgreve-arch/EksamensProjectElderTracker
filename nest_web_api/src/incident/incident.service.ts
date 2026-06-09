import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IncidentReport } from '../entities/incident.entity';
import { CreateIncidentReportDto, UpdateIncidentReportDto } from '../dto/incident.dto';

/**
 * Service handling CRUD operations for incident reports.
 *
 * The service uses a TypeORM repository to create, read, update,
 * and delete `IncidentReport` entities and returns entities with
 * relations loaded where appropriate (resident, respondedBy).
 */
@Injectable()
export class IncidentService {
  constructor(
    @InjectRepository(IncidentReport)
    private readonly incidentRepository: Repository<IncidentReport>,
  ) {}

  /**
   * Create and persist a new incident report.
   * The DTO must include `Resident_ID` and `User_ID` (responder),
   * and may include `Title` and `Description`.
   */
  async create(dto: CreateIncidentReportDto): Promise<IncidentReport> {
    const report = this.incidentRepository.create({
      resident: { Resident_ID: dto.Resident_ID },
      respondedBy: { User_ID: dto.User_ID },
      Title: dto.Title,
      Description: dto.Description,
    });
    return this.incidentRepository.save(report);
  }

  /**
   * Return all incident reports with related resident and responder,
   * ordered by date (newest first).
   */
  async findAll(): Promise<IncidentReport[]> {
    return this.incidentRepository.find({
      relations: ['resident', 'respondedBy'],
      order: { Date: 'DESC' },
    });
  }

  /**
   * Find one incident report by its primary key. Returns `null` if not found.
   */
  async findOne(id: number): Promise<IncidentReport | null> {
    return this.incidentRepository.findOne({
      where: { ID: id },
      relations: ['resident', 'respondedBy'],
    });
  }

  /**
   * Find all incident reports for a specific resident.
   */
  async findByResident(residentId: number): Promise<IncidentReport[]> {
    return this.incidentRepository.find({
      where: { resident: { Resident_ID: residentId } },
      relations: ['resident', 'respondedBy'],
      order: { Date: 'DESC' },
    });
  }

  /**
   * Update provided fields of an incident report. `respondedBy` is only
   * updated when `User_ID` is present in the DTO.
   */
  async update(id: number, dto: UpdateIncidentReportDto): Promise<IncidentReport | null> {
    await this.incidentRepository.update(id, {
      Title: dto.Title,
      Description: dto.Description,
      respondedBy: dto.User_ID ? { User_ID: dto.User_ID } : undefined,
    });
    return this.findOne(id);
  }

  /**
   * Delete an incident report by ID.
   */
  async remove(id: number): Promise<void> {
    await this.incidentRepository.delete(id);
  }
}