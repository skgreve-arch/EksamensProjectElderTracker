import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resident } from '../entities/resident.entity';
import { CreateResidentDto, UpdateResidentDto } from '../dto/resident.dto';
import { TrackersService } from '../trackers/trackers.service';

/**
 * Service managing residents and their association with trackers.
 *
 * Validates tracker assignments via `TrackersService` when creating or
 * updating a resident to ensure referential integrity.
 */
@Injectable()
export class ResidentsService {
  constructor(
    @InjectRepository(Resident)
    private readonly residentRepository: Repository<Resident>,
    private readonly trackersService: TrackersService,
  ) {}

  /**
   * Create a new resident. If `Tracker_ID` is present, verify the tracker
   * exists before associating it to avoid dangling foreign keys.
   *
   * Throws `BadRequestException` when a tracker id is provided but not found.
   */
  async create(dto: CreateResidentDto): Promise<Resident> {
    if (dto.Tracker_ID) {
      const tracker = await this.trackersService.findOne(dto.Tracker_ID);
      if (!tracker) {
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
   * Return all residents with their tracker relations loaded.
   */
  async findAll(): Promise<Resident[]> {
    return this.residentRepository.find({
      relations: ['tracker'],
    });
  }

  /**
   * Find a resident by primary key, including the tracker relation.
   */
  async findOne(residentId: number): Promise<Resident | null> {
    return this.residentRepository.findOne({
      where: { Resident_ID: residentId },
      relations: ['tracker'],
    });
  }

  /**
   * Update a resident's properties. If `Tracker_ID` is present, it will
   * be used to associate the resident with the tracker.
   */
  async update(residentId: number, dto: UpdateResidentDto): Promise<Resident | null> {
    await this.residentRepository.update(residentId, {
      ...dto,
      tracker: dto.Tracker_ID ? { Tracker_ID: dto.Tracker_ID } : undefined,
    });
    return this.findOne(residentId);
  }

  /**
   * Remove a resident row by ID.
   */
  async remove(residentId: number): Promise<void> {
    await this.residentRepository.delete(residentId);
  }

  /**
   * Find a resident assigned to a particular tracker.
   */
  async findByTracker(trackerId: number): Promise<Resident | null> {
    return this.residentRepository.findOne({
      where: { tracker: { Tracker_ID: trackerId } },
      relations: ['tracker'],
    });
  }
}