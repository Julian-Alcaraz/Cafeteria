import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { permissionIds, password_hash, ...rest } = createUserDto;
    
    const hashed = password_hash ? await bcrypt.hash(password_hash, 10) : undefined;
    
    const user = this.userRepository.create({
      ...rest,
      password_hash: hashed,
      permissions: permissionIds ? permissionIds.map((id: number) => ({ id } as any)) : [],
    });
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find({ relations: { permissions: true } });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ 
      where: { id },
      relations: { permissions: true }
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    const { permissionIds, password_hash, ...rest } = updateUserDto;
    
    // Actualizamos datos básicos
    Object.assign(user, rest);

    if (password_hash) {
      user.password_hash = await bcrypt.hash(password_hash, 10);
    }

    // Actualizamos la relación ManyToMany de permisos
    // TypeORM necesita que sobreescribamos completamente el array para que borre los que ya no están.
    if (permissionIds !== undefined) {
      user.permissions = permissionIds.map((permId: number) => ({ id: permId } as any));
    }

    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }
}
