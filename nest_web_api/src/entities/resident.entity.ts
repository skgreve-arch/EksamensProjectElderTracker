import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { Tracker } from './tracker.entity';
import { IncidentReport } from './incident.entity';

@Entity('Residents')
export class Resident {
  @PrimaryGeneratedColumn()
  Resident_ID: number;

  @Column()
  Name: string;

  @Column({ nullable: true })
  Address: string;

  @Column({ nullable: true })
  EmergencyContact: string;

  @Column({ nullable: true })
  HealthStatus: string;

  @OneToOne(() => Tracker)
  @JoinColumn({ name: 'Tracker_ID' })
  tracker: Tracker;

  @OneToMany(() => IncidentReport, incident => incident.resident)
  incidentReports: IncidentReport[];
}