import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/user.entity';
import { TeamDetail } from './team-detail.entity';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 100 })
  province: string;

  @Column({ length: 100 })
  district: string;

  @Column({ length: 500, nullable: true })
  address: string;

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

  @OneToMany(() => TeamDetail, teamDetail => teamDetail.location)
  teamDetails: TeamDetail[];
}
