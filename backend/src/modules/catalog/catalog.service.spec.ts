import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatalogService } from './catalog.service.js';
import { Product } from './entities/product.entity.js';
import { Category } from './entities/category.entity.js';
import { ProductType } from './entities/product-type.entity.js';
import { CoffeeVariety } from './entities/coffee-variety.entity.js';

describe('CatalogService', () => {
  let service: CatalogService;
  let productRepo: Repository<Product>;
  let categoryRepo: Repository<Category>;

  const mockProduct = {
    id: 1,
    name: 'Latte',
    productTypeId: 1,
    deshabilitado: false,
  };

  const mockCategory = {
    id: 1,
    name: 'Bebidas',
    deshabilitado: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            find: vi.fn(),
            findOne: vi.fn().mockResolvedValue(mockProduct),
            create: vi.fn().mockReturnValue(mockProduct),
            save: vi.fn().mockResolvedValue(mockProduct),
          },
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {
            find: vi.fn(),
            findOne: vi.fn().mockResolvedValue(mockCategory),
            create: vi.fn().mockReturnValue(mockCategory),
            save: vi.fn().mockResolvedValue(mockCategory),
          },
        },
        {
          provide: getRepositoryToken(ProductType),
          useValue: {
            find: vi.fn(),
          },
        },
        {
          provide: getRepositoryToken(CoffeeVariety),
          useValue: {
            find: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CatalogService>(CatalogService);
    productRepo = module.get<Repository<Product>>(getRepositoryToken(Product));
    categoryRepo = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneProduct', () => {
    it('should return a product', async () => {
      const result = await service.findOneProduct(1);
      expect(result).toEqual(mockProduct);
      expect(productRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1, deshabilitado: false },
        relations: { productType: true, category: true },
      });
    });

    it('should throw NotFoundException if not found', async () => {
      vi.spyOn(productRepo, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOneProduct(99)).rejects.toThrow('no encontrado');
    });
  });

  describe('createProduct', () => {
    it('should create and save a product', async () => {
      vi.spyOn(productRepo, 'findOne').mockResolvedValueOnce(null); // sku no existe
      const dto = { name: 'Latte', productTypeId: 1 };
      const result = await service.createProduct(dto);
      expect(productRepo.create).toHaveBeenCalledWith(dto);
      expect(productRepo.save).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });
  });
});
