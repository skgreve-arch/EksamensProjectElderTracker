import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('Roles')
export class Role {
  @PrimaryGeneratedColumn()
  Role_ID: number;

  @Column()
  Role: string;

  @OneToMany(() => User, user => user.role)
  users: User[];
}