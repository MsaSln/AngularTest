import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create({
      name: createRoleDto.name,
      description: createRoleDto.description,
      isActive: createRoleDto.isActive,
    });

    if (createRoleDto.permissionIds && createRoleDto.permissionIds.length > 0) {
      role.permissions = await this.permissionRepository.find({
        where: { id: In(createRoleDto.permissionIds) },
      });
    }

    return await this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find({
      relations: ['permissions'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    Object.assign(role, {
      name: updateRoleDto.name,
      description: updateRoleDto.description,
      isActive: updateRoleDto.isActive,
    });

    if (updateRoleDto.permissionIds !== undefined) {
      if (updateRoleDto.permissionIds.length > 0) {
        role.permissions = await this.permissionRepository.find({
          where: { id: In(updateRoleDto.permissionIds) },
        });
      } else {
        role.permissions = [];
      }
    }

    return await this.roleRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
  }

  async getUserPermissions(userId: number): Promise<string[]> {
    const roles = await this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .leftJoin('role.users', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('role.isActive = :isActive', { isActive: true })
      .getMany();

    const permissionNames = new Set<string>();
    roles.forEach(role => {
      role.permissions.forEach(permission => {
        permissionNames.add(permission.name);
      });
    });

    return Array.from(permissionNames);
  }
}
