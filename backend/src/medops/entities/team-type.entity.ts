import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Team } from './team.entity';

@Entity('team_types')
export class TeamType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string;

  @Column({ length: 20, unique: true })
  code: string;

  @Column({ name: 'display_order', default: 0 })
  displayOrder: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Team, team => team.teamType)
  teams: Team[];
}
