import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MenuGroup } from './menu-group.entity';

export enum MenuLocation {
  SIDEBAR = 'sidebar',
  HEADER = 'header',
  BOTH = 'both',
}

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  route: string;

  @Column({ nullable: true })
  icon: string;

  @Column({
    type: 'varchar',
    enum: MenuLocation,
    default: MenuLocation.SIDEBAR,
  })
  location: MenuLocation;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => MenuGroup, menuGroup => menuGroup.menuItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menuGroupId' })
  menuGroup: MenuGroup;

  @Column()
  menuGroupId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
