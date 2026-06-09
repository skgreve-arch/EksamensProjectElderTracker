import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ResidentsService } from './residents.service';
import { CreateResidentDto, UpdateResidentDto } from '../dto/resident.dto';
import { Resident } from '../entities/resident.entity';

/**
 * Controller exposing residents endpoints for creation, lookup, update
 * and deletion. Endpoints handle parsing of route parameters and delegate
 * behavior to `ResidentsService`.
 */
@Controller('residents')
export class ResidentsController {
  constructor(private readonly residentsService: ResidentsService) {}

  // POST /residents
  @Post()
  create(@Body() dto: CreateResidentDto): Promise<Resident> {
    return this.residentsService.create(dto);
  }

  // GET /residents
  @Get()
  findAll(): Promise<Resident[]> {
    return this.residentsService.findAll();
  }

  // GET /residents/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Resident | null> {
    return this.residentsService.findOne(id);
  }

  // GET /residents/tracker/:trackerId
  @Get('tracker/:trackerId')
  findByTracker(@Param('trackerId', ParseIntPipe) trackerId: number): Promise<Resident | null> {
    return this.residentsService.findByTracker(trackerId);
  }

  // PATCH /residents/:id
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateResidentDto,
  ): Promise<Resident | null> {
    return this.residentsService.update(id, dto);
  }

  // DELETE /residents/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.residentsService.remove(id);
  }
}