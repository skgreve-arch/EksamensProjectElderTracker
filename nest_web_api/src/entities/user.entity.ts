import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Role } from './role.entity';
import { IncidentReport } from './incident.entity';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn()
  User_ID: number;

  @Column()
  Email: string;

  @Column()
  Name: string;

  @Column()
  PasswordHash: string;

  @Column()
  PasswordSalt: string;

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'Role_ID' })
  role: Role;

  @OneToMany(() => IncidentReport, incident => incident.respondedBy)
  incidentReports: IncidentReport[];
}