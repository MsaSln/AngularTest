import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuGroup } from './entities/menu-group.entity';
import { MenuItem } from './entities/menu-item.entity';
import { MenuGroupsService } from './menu-groups.service';
import { MenuItemsService } from './menu-items.service';
import { MenuGroupsController } from './menu-groups.controller';
import { MenuItemsController } from './menu-items.controller';
import { MenuSeedService } from './menu-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuGroup, MenuItem])],
  controllers: [MenuGroupsController, MenuItemsController],
  providers: [MenuGroupsService, MenuItemsService, MenuSeedService],
  exports: [MenuGroupsService, MenuItemsService],
})
export class MenuModule {}
