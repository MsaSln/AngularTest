import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/user.entity';
import { TeamType } from './team-type.entity';
import { TeamDetailType } from './team-detail-type.entity';
import { TeamDetail } from './team-detail.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ name: 'team_number', length: 50, unique: true })
  teamNumber: string;

  @Column({ name: 'team_type_id' })
  teamTypeId: number;

  @Column({ name: 'detail_type_id' })
  detailTypeId: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @Column({ name: 'deleted_by', nullable: true })
  deletedBy: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updater: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'deleted_by' })
  deleter: User;

  @ManyToOne(() => TeamType, teamType => teamType.teams)
  @JoinColumn({ name: 'team_type_id' })
  teamType: TeamType;

  @ManyToOne(() => TeamDetailType, detailType => detailType.teams)
  @JoinColumn({ name: 'detail_type_id' })
  detailType: TeamDetailType;

  @OneToMany(() => TeamDetail, teamDetail => teamDetail.team)
  teamDetails: TeamDetail[];
}
