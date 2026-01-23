import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/user.entity';
import { Team } from './team.entity';
import { Location } from './location.entity';
import { Vehicle } from './vehicle.entity';
import { Personnel } from './personnel.entity';

@Entity('team_details')
export class TeamDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'team_id' })
  teamId: number;

  @Column({ name: 'location_id', nullable: true })
  locationId: number;

  @Column({ name: 'vehicle_id', nullable: true })
  vehicleId: number;

  @Column({ name: 'personnel_id', nullable: true })
  personnelId: number;

  @Column({ name: 'display_order', default: 0 })
  displayOrder: number;

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

  @ManyToOne(() => Team, team => team.teamDetails)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @ManyToOne(() => Location, location => location.teamDetails)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @ManyToOne(() => Vehicle, vehicle => vehicle.teamDetails)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @ManyToOne(() => Personnel, personnel => personnel.teamDetails)
  @JoinColumn({ name: 'personnel_id' })
  personnel: Personnel;
}
