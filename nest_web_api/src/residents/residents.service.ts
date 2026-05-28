import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resident } from '../entities/resident.entity';
import { CreateResidentDto, UpdateResidentDto } from '../dto/resident.dto';
import { TrackersService } from '../trackers/trackers.service';

@Injectable()
export class ResidentsService {
  constructor(
    @InjectRepository(Resident)
    private readonly residentRepository: Repository<Resident>,
    private readonly trackersService: TrackersService,
  ) {}

  /**
   * Creates a new resident in the database. If a Tracker_ID is provided, it validates that the tracker exists before associating it with the resident.
   * @param dto 
   * @returns A promise resolving to the created Resident entity, including its associated tracker if applicable.
    * @throws BadRequestException if a Tracker_ID is provided but the tracker does not exist.
   */
  async create(dto: CreateResidentDto): Promise<Resident> 
  {
    if (dto.Tracker_ID) 
    {
      const tracker = await this.trackersService.findOne(dto.Tracker_ID);
      if (!tracker) 
      {
        throw new BadRequestException(`Tracker with ID ${dto.Tracker_ID} does not exist`);
      }
    }

    const resident = this.residentRepository.create({
      ...dto,
      tracker: dto.Tracker_ID ? { Tracker_ID: dto.Tracker_ID } : undefined,
    });
    return this.residentRepository.save(resident);
  }

  /**
   * Retrieves all residents from the database, including their associated trackers.
   * @returns A promise resolving to an array of Resident entities with their trackers.
   */
  async findAll(): Promise<Resident[]> 
  {
    return this.residentRepository.find({
      relations: ['tracker'],
    });
  }

  /**
   * Retrieves a resident by their ID, including their associated tracker.
   * @param residentId The ID of the resident to retrieve.
   * @returns A promise resolving to the Resident entity with their tracker, or null if not found.
   */
  async findOne(residentId: number): Promise<Resident | null> 
  {
    return this.residentRepository.findOne({
      where: { Resident_ID: residentId },
      relations: ['tracker'],
    });
  }

  /**
   * Updates a resident's information in the database. If a Tracker_ID is provided in the update DTO, it validates that the tracker exists before updating the association.
   * @param residentId The ID of the resident to update.
   * @param dto The update DTO containing the new information.
   * @returns A promise resolving to the updated Resident entity, or null if not found.
   */
  async update(residentId: number, dto: UpdateResidentDto): Promise<Resident | null> 
  {
    await this.residentRepository.update(residentId, {
      ...dto,
      tracker: dto.Tracker_ID ? { Tracker_ID: dto.Tracker_ID } : undefined,
    });
    return this.findOne(residentId);
  }

  /**
   * Removes a resident from the database.
   * @param residentId The ID of the resident to remove.
   */
  async remove(residentId: number): Promise<void> 
  {
    await this.residentRepository.delete(residentId);
  }

  /**
   * Finds a resident by their associated tracker ID.
   * @param trackerId The ID of the tracker to search for.
   * @returns A promise resolving to the Resident entity with the specified tracker, or null if not found.
   */
  async findByTracker(trackerId: number): Promise<Resident | null> 
  {
    return this.residentRepository.findOne({
      where: { tracker: { Tracker_ID: trackerId } },
      relations: ['tracker'],
    });
  }
}