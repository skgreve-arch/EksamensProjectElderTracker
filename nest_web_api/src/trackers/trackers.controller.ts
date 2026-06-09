import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { TrackersService } from './trackers.service';
import { CreateTrackerDto, UpdateTrackerDto } from '../dto/tracker.dto';
import { Tracker } from '../entities/tracker.entity';

/**
 * Exposes tracker management endpoints. Controller handles request
 * parameter parsing and delegates business logic to `TrackersService`.
 */
@Controller('trackers')
export class TrackersController {
  constructor(private readonly trackersService: TrackersService) {}

  // POST /trackers
  @Post()
  create(@Body() dto: CreateTrackerDto): Promise<Tracker> {
    return this.trackersService.create(dto);
  }

  // GET /trackers
  @Get()
  findAll(): Promise<Tracker[]> {
    return this.trackersService.findAll();
  }

  // GET /trackers/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Tracker | null> {
    return this.trackersService.findOne(id);
  }

  // PATCH /trackers/:id
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTrackerDto): Promise<Tracker | null> {
    return this.trackersService.update(id, dto);
  }

  // DELETE /trackers/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.trackersService.remove(id);
  }

  // GET /trackers/unassigned
  @Get('unassigned')
  findUnassigned(): Promise<Tracker[]> {
    return this.trackersService.findUnassigned();
  }
}