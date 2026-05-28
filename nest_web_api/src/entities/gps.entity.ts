import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Tracker } from './tracker.entity';

@Entity('GPS_Locations')
export class GpsLocation {
  @PrimaryGeneratedColumn()
  ID: number;

  @ManyToOne(() => Tracker, tracker => tracker.gpsLocations)
  @JoinColumn({ name: 'Tracker_ID' })
  tracker: Tracker;

  @Column('float')
  lng: number;

  @Column('float')
  lat: number;

  @CreateDateColumn()
  Timestamp: Date;
}