import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/user.entity';
import { TeamDetail } from './team-detail.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, unique: true })
  plate: string; // Full plate: "34ASD34"

  @Column({ name: 'plate_province', length: 3 })
  plateProvince: string; // "34"

  @Column({ name: 'plate_letters', length: 5 })
  plateLetters: string; // "ASD"

  @Column({ name: 'plate_numbers', length: 5 })
  plateNumbers: string; // "34"

  @Column({ name: 'vehicle_number', length: 50, unique: true })
  vehicleNumber: string;

  @Column({ length: 100, nullable: true })
  brand: string;

  @Column({ length: 100, nullable: true })
  model: string;

  @Column({ name: 'phone_telsiz', length: 50, nullable: true })
  phoneTelsiz: string;

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

  @OneToMany(() => TeamDetail, teamDetail => teamDetail.vehicle)
  teamDetails: TeamDetail[];
}
