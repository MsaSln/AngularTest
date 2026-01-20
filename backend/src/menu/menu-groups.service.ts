import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuGroup } from './entities/menu-group.entity';
import { CreateMenuGroupDto } from './dto/create-menu-group.dto';
import { UpdateMenuGroupDto } from './dto/update-menu-group.dto';

@Injectable()
export class MenuGroupsService {
  constructor(
    @InjectRepository(MenuGroup)
    private menuGroupRepository: Repository<MenuGroup>,
  ) {}

  async create(createMenuGroupDto: CreateMenuGroupDto): Promise<MenuGroup> {
    const menuGroup = this.menuGroupRepository.create(createMenuGroupDto);
    return await this.menuGroupRepository.save(menuGroup);
  }

  async findAll(): Promise<MenuGroup[]> {
    return await this.menuGroupRepository.find({
      relations: ['menuItems'],
      order: { order: 'ASC', menuItems: { order: 'ASC' } },
    });
  }

  async findActive(): Promise<MenuGroup[]> {
    return await this.menuGroupRepository.find({
      where: { isActive: true },
      relations: ['menuItems'],
      order: { order: 'ASC', menuItems: { order: 'ASC' } },
    });
  }

  async findOne(id: number): Promise<MenuGroup> {
    const menuGroup = await this.menuGroupRepository.findOne({
      where: { id },
      relations: ['menuItems'],
    });

    if (!menuGroup) {
      throw new NotFoundException(`Menu group with ID ${id} not found`);
    }

    return menuGroup;
  }

  async update(id: number, updateMenuGroupDto: UpdateMenuGroupDto): Promise<MenuGroup> {
    const menuGroup = await this.findOne(id);
    Object.assign(menuGroup, updateMenuGroupDto);
    return await this.menuGroupRepository.save(menuGroup);
  }

  async remove(id: number): Promise<void> {
    const menuGroup = await this.findOne(id);
    await this.menuGroupRepository.remove(menuGroup);
  }
}
