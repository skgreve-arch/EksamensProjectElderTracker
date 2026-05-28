import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Resident } from './resident.entity';
import { User } from './user.entity';

@Entity('Incident_reports')
export class IncidentReport 
{
  @PrimaryGeneratedColumn()
  ID: number;

  @ManyToOne(() => Resident, resident => resident.incidentReports)
  @JoinColumn({ name: 'Resident_ID' })
  resident: Resident;

  @CreateDateColumn()
  Date: Date;

  @Column({ nullable: true })
  Description: string;

  @ManyToOne(() => User, user => user.incidentReports)
  @JoinColumn({ name: 'User_ID' })
  respondedBy: User;
}