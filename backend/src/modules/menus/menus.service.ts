import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity.js';
import { CreateMenuDto } from './dto/create-menu.dto.js';
import { UpdateMenuDto } from './dto/update-menu.dto.js';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  create(createMenuDto: CreateMenuDto) {
    const { permission_id, ...rest } = createMenuDto as any;
    const menu = this.menuRepository.create({
      ...rest,
      requiredPermission: permission_id ? { id: permission_id } as any : null,
    });
    return this.menuRepository.save(menu);
  }

  findAll() {
    return this.menuRepository.find({ relations: { children: true, requiredPermission: true, parent: true } });
  }

  async findOne(id: number) {
    const menu = await this.menuRepository.findOne({ 
      where: { id },
      relations: { children: true, requiredPermission: true, parent: true }
    });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return menu;
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    const menu = await this.findOne(id);
    const updateData: any = { ...updateMenuDto };
    
    if (updateMenuDto.permission_id !== undefined) {
      updateData.requiredPermission = updateMenuDto.permission_id ? { id: updateMenuDto.permission_id } : null;
      delete updateData.permission_id;
    }

    const updated = this.menuRepository.merge(menu, updateData);
    return this.menuRepository.save(updated);
  }

  async remove(id: number) {
    const menu = await this.findOne(id);
    return this.menuRepository.remove(menu);
  }
}
