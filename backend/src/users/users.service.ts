import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../rbac/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { generatePassword } from '../common/utils/password-generator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(username: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['roles'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get a single user by ID with roles
   */
  async findOneWithRoles(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Create a new user with auto-generated password
   */
  async createUser(createUserDto: CreateUserDto): Promise<{ user: User; password: string }> {
    // Check if username already exists
    const existingUser = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    // Check if email already exists
    const existingEmail = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    // Generate password
    const plainPassword = generatePassword(12);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Get roles
    const roles = await this.roleRepository.find({
      where: { id: In(createUserDto.roleIds) },
    });

    if (roles.length !== createUserDto.roleIds.length) {
      throw new BadRequestException('One or more role IDs are invalid');
    }

    // Create user
    const user = this.usersRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
      roles,
    });

    const savedUser = await this.usersRepository.save(user);

    // Return user and plain password (to be shown once to admin)
    return {
      user: savedUser,
      password: plainPassword,
    };
  }

  /**
   * Update user details and roles
   */
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneWithRoles(id);

    // Check if username is being changed and if it already exists
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.usersRepository.findOne({
        where: { username: updateUserDto.username },
      });

      if (existingUser) {
        throw new BadRequestException('Username already exists');
      }
      user.username = updateUserDto.username;
    }

    // Check if email is being changed and if it already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingEmail) {
        throw new BadRequestException('Email already exists');
      }
      user.email = updateUserDto.email;
    }

    // Update roles if provided
    if (updateUserDto.roleIds) {
      const roles = await this.roleRepository.find({
        where: { id: In(updateUserDto.roleIds) },
      });

      if (roles.length !== updateUserDto.roleIds.length) {
        throw new BadRequestException('One or more role IDs are invalid');
      }

      user.roles = roles;
    }

    // Update isActive if provided
    if (updateUserDto.isActive !== undefined) {
      user.isActive = updateUserDto.isActive;
    }

    return this.usersRepository.save(user);
  }

  /**
   * Delete a user
   */
  async remove(id: number): Promise<void> {
    const user = await this.findOneWithRoles(id);
    await this.usersRepository.remove(user);
  }

  /**
   * Reset user password
   */
  async resetPassword(id: number): Promise<string> {
    const user = await this.findOneWithRoles(id);

    // Generate new password
    const plainPassword = generatePassword(12);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    user.password = hashedPassword;
    await this.usersRepository.save(user);

    return plainPassword;
  }

  /**
   * Toggle user active status
   */
  async toggleActive(id: number): Promise<User> {
    const user = await this.findOneWithRoles(id);
    user.isActive = !user.isActive;
    return this.usersRepository.save(user);
  }
}
