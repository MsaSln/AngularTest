import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MenuGroupsService } from './menu-groups.service';
import { CreateMenuGroupDto } from './dto/create-menu-group.dto';
import { UpdateMenuGroupDto } from './dto/update-menu-group.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('menu-groups')
@UseGuards(JwtAuthGuard)
export class MenuGroupsController {
  constructor(private readonly menuGroupsService: MenuGroupsService) {}

  @Post()
  create(@Body() createMenuGroupDto: CreateMenuGroupDto) {
    return this.menuGroupsService.create(createMenuGroupDto);
  }

  @Get()
  findAll() {
    return this.menuGroupsService.findAll();
  }

  @Get('active')
  findActive() {
    return this.menuGroupsService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuGroupsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuGroupDto: UpdateMenuGroupDto) {
    return this.menuGroupsService.update(+id, updateMenuGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuGroupsService.remove(+id);
  }
}
