import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Tracker } from './tracker.entity';

@Entity('Alarms')
export class Alarm 
{
  @PrimaryGeneratedColumn()
  Alarm_ID: number;

  @ManyToOne(() => Tracker)
  @JoinColumn({ name: 'Tracker_ID' })
  tracker: Tracker;

  @CreateDateColumn()
  Timestamp: Date;
}