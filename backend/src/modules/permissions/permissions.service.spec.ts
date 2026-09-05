import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity.js';
import { Repository } from 'typeorm';

const mockRepository = () => ({
  create: vi.fn(),
  save: vi.fn(),
  find: vi.fn(),
  findOneBy: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, vi.Mock>>;

describe('PermissionsService', () => {
  let service: PermissionsService;
  let repository: MockRepository<Permission>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: getRepositoryToken(Permission),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    repository = module.get(getRepositoryToken(Permission));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully insert a permission', async () => {
      const dto = { name: 'Test Permission' };
      const entity = { id: 1, ...dto };
      repository.create.mockReturnValue(entity);
      repository.save.mockResolvedValue(entity);

      expect(await service.create(dto)).toEqual(entity);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(entity);
    });
  });

  describe('findAll', () => {
    it('should return an array of permissions', async () => {
      const entityArray = [{ id: 1, name: 'Test' }];
      repository.find.mockResolvedValue(entityArray);

      expect(await service.findAll()).toEqual(entityArray);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single permission', async () => {
      const entity = { id: 1, name: 'Test' };
      repository.findOneBy.mockResolvedValue(entity);

      expect(await service.findOne(1)).toEqual(entity);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('update', () => {
    it('should call update and return updated permission', async () => {
      const dto = { name: 'Updated Permission' };
      const entity = { id: 1, ...dto };
      repository.update.mockResolvedValue({ affected: 1 });
      repository.findOneBy.mockResolvedValue(entity);

      expect(await service.update(1, dto)).toEqual(entity);
      expect(repository.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a permission', async () => {
      const entity = { id: 1, name: 'Test' };
      repository.findOneBy.mockResolvedValue(entity);
      repository.remove.mockResolvedValue(entity);

      expect(await service.remove(1)).toEqual(entity);
      expect(repository.remove).toHaveBeenCalledWith(entity);
    });
    
    it('should return null if not found', async () => {
      repository.findOneBy.mockResolvedValue(null);
      expect(await service.remove(1)).toEqual(null);
    });
  });
});
