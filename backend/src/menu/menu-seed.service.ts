import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuGroup } from './entities/menu-group.entity';
import { MenuItem, MenuLocation } from './entities/menu-item.entity';

@Injectable()
export class MenuSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(MenuGroup)
    private menuGroupRepository: Repository<MenuGroup>,
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
  ) {}

  async onModuleInit() {
    await this.seedMenus();
  }

  private async seedMenus() {
    // Check if menus already exist
    const count = await this.menuGroupRepository.count();
    if (count > 0) {
      console.log('Menus already seeded, skipping...');
      return;
    }

    console.log('Seeding menu data...');

    // Create Main Menu Group
    const mainGroup = await this.menuGroupRepository.save({
      name: 'Main Menu',
      icon: '📋',
      order: 1,
      isActive: true,
    });

    await this.menuItemRepository.save([
      {
        title: 'Dashboard',
        description: 'Main dashboard',
        route: '/dashboard',
        icon: '🏠',
        location: MenuLocation.BOTH,
        order: 1,
        isActive: true,
        menuGroupId: mainGroup.id,
      },
      {
        title: 'Menu Management',
        description: 'Manage application menus',
        route: '/menu-management',
        icon: '⚙️',
        location: MenuLocation.SIDEBAR,
        order: 2,
        isActive: true,
        menuGroupId: mainGroup.id,
      },
    ]);

    // Create Reports Group
    const reportsGroup = await this.menuGroupRepository.save({
      name: 'Reports',
      icon: '📊',
      order: 2,
      isActive: true,
    });

    await this.menuItemRepository.save([
      {
        title: 'Analytics',
        description: 'View analytics reports',
        route: '/analytics',
        icon: '📈',
        location: MenuLocation.HEADER,
        order: 1,
        isActive: true,
        menuGroupId: reportsGroup.id,
      },
      {
        title: 'Statistics',
        description: 'View statistics',
        route: '/statistics',
        icon: '📉',
        location: MenuLocation.SIDEBAR,
        order: 2,
        isActive: true,
        menuGroupId: reportsGroup.id,
      },
    ]);

    console.log('Menu data seeded successfully!');
  }
}
