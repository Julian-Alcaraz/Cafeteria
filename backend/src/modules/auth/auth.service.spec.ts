import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity.js';
import { Menu } from '../menus/entities/menu.entity.js';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Permission } from '../permissions/entities/permission.entity.js';

vi.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userRepo: any;
  let menuRepo: any;

  beforeEach(async () => {
    userRepo = { findOne: vi.fn() };
    menuRepo = { find: vi.fn() };
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: getRepositoryToken(Menu), useValue: menuRepo },
        { provide: JwtService, useValue: { sign: vi.fn().mockReturnValue('token123') } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should throw UnauthorizedException if user not found', async () => {
    userRepo.findOne.mockResolvedValue(null);
    await expect(service.login({ username: 'invalid', password: 'pw' })).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password mismatch', async () => {
    userRepo.findOne.mockResolvedValue({ username: 'test', password_hash: 'hash', permissions: [] });
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);
    
    await expect(service.login({ username: 'test', password: 'pw' })).rejects.toThrow(UnauthorizedException);
  });

  it('should return access_token and build correct menu tree on success', async () => {
    const p1 = new Permission(); p1.id = 1; p1.name = 'p1';
    userRepo.findOne.mockResolvedValue({ 
      id: 1, 
      username: 'test', 
      password_hash: 'hash', 
      permissions: [p1] 
    });
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

    const menu1 = new Menu(); menu1.id = 1; menu1.requiredPermission = null; menu1.parent_id = null;
    const menu2 = new Menu(); menu2.id = 2; menu2.requiredPermission = p1; menu2.parent_id = 1;
    const menu3 = new Menu(); menu3.id = 3; menu3.requiredPermission = { id: 99 } as Permission; menu3.parent_id = 1;
    
    menuRepo.find.mockResolvedValue([menu1, menu2, menu3]);

    const result = await service.login({ username: 'test', password: 'pw' });
    
    expect(result.access_token).toBe('token123');
    expect(jwtService.sign).toHaveBeenCalled();
    const payloadArg = vi.mocked(jwtService.sign).mock.calls[0][0];
    
    expect(payloadArg.sub).toBe(1);
    expect(payloadArg.permissions).toEqual(['p1']);
    
    // Check menu tree: menu1 should be root, menu2 child, menu3 filtered out
    expect(payloadArg.menus.length).toBe(1);
    expect(payloadArg.menus[0].id).toBe(1);
    expect(payloadArg.menus[0].children.length).toBe(1);
    expect(payloadArg.menus[0].children[0].id).toBe(2);
  });
});
