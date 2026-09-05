import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

const mockUser = { id: 1, username: 'test', password_hash: 'hashed_pw', permissions: [] };
const mockUserArray = [mockUser];

const mockRepository = {
  create: vi.fn().mockImplementation((dto) => dto),
  save: vi.fn().mockImplementation((entity) => Promise.resolve({ id: 1, ...entity })),
  find: vi.fn().mockResolvedValue(mockUserArray),
  findOne: vi.fn().mockResolvedValue(mockUser),
  merge: vi.fn().mockImplementation((entity, dto) => ({ ...entity, ...dto })),
  remove: vi.fn().mockResolvedValue(mockUser),
};

vi.mock('bcrypt', () => ({
  hash: vi.fn().mockResolvedValue('new_hashed_pw'),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and hash password', async () => {
      const dto = { username: 'test2', password_hash: 'plain', permissionIds: [1] };
      const expectedCreate = { username: 'test2', password_hash: 'new_hashed_pw', permissions: [{ id: 1 }] };
      
      const result = await service.create(dto);
      
      expect(bcrypt.hash).toHaveBeenCalledWith('plain', 10);
      expect(repo.create).toHaveBeenCalledWith(expectedCreate);
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual({ id: 1, ...expectedCreate });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      expect(await service.findAll()).toEqual(mockUserArray);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should get a single user', async () => {
      expect(await service.findOne(1)).toEqual(mockUser);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: { permissions: true } });
    });

    it('should throw NotFoundException if user not found', async () => {
      vi.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user and hash new password', async () => {
      const dto = { password_hash: 'newplain', permissionIds: [2] };
      const updateData = { password_hash: 'new_hashed_pw', permissions: [{ id: 2 }] };
      const updatedEntity = { ...mockUser, ...updateData };
      vi.spyOn(repo, 'save').mockResolvedValueOnce(updatedEntity as any);
      
      expect(await service.update(1, dto)).toEqual(updatedEntity);
      expect(repo.findOne).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('newplain', 10);
      expect(repo.merge).toHaveBeenCalledWith(mockUser, updateData);
      expect(repo.save).toHaveBeenCalledWith(updatedEntity);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      expect(await service.remove(1)).toEqual(mockUser);
      expect(repo.findOne).toHaveBeenCalled();
      expect(repo.remove).toHaveBeenCalledWith(mockUser);
    });
  });
});
