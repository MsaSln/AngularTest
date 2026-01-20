import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    const { password, ...result } = user;
    return result;
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map(user => {
      const { password, ...result } = user;
      return result;
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOneWithRoles(+id);
    const { password, ...result } = user;
    return result;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const { user, password } = await this.usersService.createUser(createUserDto);
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      generatedPassword: password, // Return password to be shown once
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.updateUser(+id, updateUserDto);
    const { password, ...result } = user;
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(+id);
    return { message: 'User deleted successfully' };
  }

  @Post(':id/reset-password')
  async resetPassword(@Param('id') id: string) {
    const newPassword = await this.usersService.resetPassword(+id);
    return {
      message: 'Password reset successfully',
      generatedPassword: newPassword,
    };
  }

  @Patch(':id/toggle-active')
  async toggleActive(@Param('id') id: string) {
    const user = await this.usersService.toggleActive(+id);
    const { password, ...result } = user;
    return result;
  }
}
