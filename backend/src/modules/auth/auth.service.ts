import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity.js';
import { LoginDto } from './dto/login.dto.js';
import { Menu } from '../menus/entities/menu.entity.js';
import { Permission } from '../permissions/entities/permission.entity.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { username },
      relations: { permissions: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Obtener los menús a los que el usuario tiene acceso
    const userPermissionIds = user.permissions.map(p => p.id);
    
    // Obtener todos los menús
    const allMenus = await this.menuRepository.find({ relations: { requiredPermission: true } });
    
    // Filtrar los menús permitidos
    const allowedMenus = allMenus.filter(menu => 
      !menu.requiredPermission || userPermissionIds.includes(menu.requiredPermission.id)
    );

    // Estructurar los menús (padre -> hijo)
    const menus = this.buildMenuTree(allowedMenus);

    const payload = {
      sub: user.id,
      username: user.username,
      permissions: user.permissions.map(p => p.name),
      menus,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private buildMenuTree(menus: Menu[]): Menu[] {
    const map = new Map<number, Menu>();
    const roots: Menu[] = [];

    menus.forEach(menu => {
      map.set(menu.id, { ...menu, children: [] });
    });

    menus.forEach(menu => {
      if (menu.parent_id) {
        const parent = map.get(menu.parent_id);
        const child = map.get(menu.id);
        if (parent && child) {
          parent.children.push(child);
        }
      } else {
        const rootNode = map.get(menu.id);
        if (rootNode) {
          roots.push(rootNode);
        }
      }
    });

    return roots;
  }
}
