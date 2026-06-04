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

  /**
   * Creates a new incident report based on the provided DTO. The report will be associated with the specified resident and user, and will include the title and optional description. The created report is then saved to the database and returned.
   * @param dto The data transfer object containing the information needed to create the incident report, including Resident_ID, User_ID, Title, and an optional Description.
   * @returns The newly created and saved incident report entity.
   */
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

  /**
   * Finds all incident reports, including related resident and user information, ordered by date descending.
   * @returns An array of all incident reports with their related resident and user data, ordered by date from newest to oldest.
   */
  async findAll(): Promise<IncidentReport[]> 
  {
    return this.incidentRepository.find({
      relations: ['resident', 'respondedBy'],
      order: { Date: 'DESC' },
    });
  }

  /**
   * Finds a single incident report by its ID.
   * @param id 
   * @returns The incident report with the given ID, or null if not found.
   */
  async findOne(id: number): Promise<IncidentReport | null> 
  {
    return this.incidentRepository.findOne({
      where: { ID: id },
      relations: ['resident', 'respondedBy'],
    });
  }

  /**
   * Finds all incident reports associated with a specific resident.
   * @param residentId 
   * @returns An array of incident reports for the given resident, ordered by date descending. If no reports are found, returns an empty array.
   */
  async findByResident(residentId: number): Promise<IncidentReport[]> 
  {
    return this.incidentRepository.find({
      where: { resident: { Resident_ID: residentId } },
      relations: ['resident', 'respondedBy'],
      order: { Date: 'DESC' },
    });
  }

  /**
   * Updates the title, description, and/or respondedBy of an incident report. Only provided fields will be updated.
   * @param id 
   * @param dto 
   * @returns The updated incident report, or null if not found.
   */
  async update(id: number, dto: UpdateIncidentReportDto): Promise<IncidentReport | null> 
  {
    await this.incidentRepository.update(id, {
      Title: dto.Title,
      Description: dto.Description,
      respondedBy: dto.User_ID ? { User_ID: dto.User_ID } : undefined,
    });
    return this.findOne(id);
  }

  /**
   * Removes an incident report by its ID.
   * @param id 
   */
  async remove(id: number): Promise<void> 
  {
    await this.incidentRepository.delete(id);
  }
}