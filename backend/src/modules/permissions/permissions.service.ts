import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto.js';
import { UpdatePermissionDto } from './dto/update-permission.dto.js';
import { Permission } from './entities/permission.entity.js';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  create(createPermissionDto: CreatePermissionDto) {
    const newPermission = this.permissionsRepository.create(createPermissionDto);
    return this.permissionsRepository.save(newPermission);
  }

  findAll() {
    return this.permissionsRepository.find();
  }

  findOne(id: number) {
    return this.permissionsRepository.findOneBy({ id });
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    await this.permissionsRepository.update(id, updatePermissionDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const permission = await this.findOne(id);
    if (permission) {
      return this.permissionsRepository.remove(permission);
    }
    return null;
  }
}
