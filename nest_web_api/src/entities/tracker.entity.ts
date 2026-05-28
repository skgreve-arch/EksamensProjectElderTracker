import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { GpsLocation } from './gps.entity';
import { Resident } from './resident.entity';

@Entity('Trackers')
export class Tracker {
  @PrimaryGeneratedColumn()
  Tracker_ID: number;

  @Column()
  IP: string;

  @Column()
  Port: number;

  @Column({ default: false })
  IsOnline: boolean;

  @Column('float', { nullable: true })
  Battery: number;

  @OneToMany(() => GpsLocation, gps => gps.tracker)
  gpsLocations: GpsLocation[];

  @OneToOne(() => Resident, resident => resident.tracker)
  resident: Resident;

  @Column({ nullable: true })
  LastSeen: Date;
}