import { Test, TestingModule } from '@nestjs/testing';
import { MenusService } from './menus.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity.js';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

const mockMenu = { id: 1, label: 'Dashboard', icon: 'dash', url: '/dash', parent_id: null, requiredPermission: null };
const mockMenuArray = [mockMenu];

const mockRepository = {
  create: vi.fn().mockImplementation((dto) => dto),
  save: vi.fn().mockImplementation((entity) => Promise.resolve({ id: 1, ...entity })),
  find: vi.fn().mockResolvedValue(mockMenuArray),
  findOne: vi.fn().mockResolvedValue(mockMenu),
  merge: vi.fn().mockImplementation((entity, dto) => ({ ...entity, ...dto })),
  remove: vi.fn().mockResolvedValue(mockMenu),
};

describe('MenusService', () => {
  let service: MenusService;
  let repo: Repository<Menu>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenusService,
        {
          provide: getRepositoryToken(Menu),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MenusService>(MenusService);
    repo = module.get<Repository<Menu>>(getRepositoryToken(Menu));
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a menu', async () => {
      const dto = { label: 'Dashboard', permission_id: 2 };
      const expectedCreate = { label: 'Dashboard', requiredPermission: { id: 2 } };
      
      const result = await service.create(dto);
      
      expect(repo.create).toHaveBeenCalledWith(expectedCreate);
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual({ id: 1, ...expectedCreate });
    });
  });

  describe('findAll', () => {
    it('should return an array of menus', async () => {
      expect(await service.findAll()).toEqual(mockMenuArray);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should get a single menu', async () => {
      expect(await service.findOne(1)).toEqual(mockMenu);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: { children: true, requiredPermission: true, parent: true } });
    });

    it('should throw NotFoundException if menu not found', async () => {
      vi.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a menu', async () => {
      const dto = { label: 'Updated', permission_id: 3 };
      const updateData = { label: 'Updated', requiredPermission: { id: 3 } };
      const updatedEntity = { ...mockMenu, ...updateData };
      vi.spyOn(repo, 'save').mockResolvedValueOnce(updatedEntity as any);
      
      expect(await service.update(1, dto)).toEqual(updatedEntity);
      expect(repo.findOne).toHaveBeenCalled();
      expect(repo.merge).toHaveBeenCalledWith(mockMenu, updateData);
      expect(repo.save).toHaveBeenCalledWith(updatedEntity);
    });
  });

  describe('remove', () => {
    it('should remove a menu', async () => {
      expect(await service.remove(1)).toEqual(mockMenu);
      expect(repo.findOne).toHaveBeenCalled();
      expect(repo.remove).toHaveBeenCalledWith(mockMenu);
    });
  });
});
