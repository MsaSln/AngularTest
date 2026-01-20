import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Role } from './role.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // e.g., "menu.groups.export", "menu.items.create"

  @Column()
  description: string;

  @Column({ nullable: true })
  resource: string; // e.g., "menu", "users", "dashboard"

  @Column({ nullable: true })
  action: string; // e.g., "create", "read", "update", "delete", "export"

  @ManyToMany(() => Role, role => role.permissions)
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
