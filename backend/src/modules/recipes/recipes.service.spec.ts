import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RecipesService } from './recipes.service.js';
import { Recipe } from './entities/recipe.entity.js';
import { RecipeIngredient } from './entities/recipe-ingredient.entity.js';

describe('RecipesService', () => {
  let service: RecipesService;
  let recipeRepo: Repository<Recipe>;

  const mockRecipe = {
    id: 1,
    productId: 1,
    name: 'Latte v1',
    version: 1,
    isActive: true,
    deshabilitado: false,
    ingredients: [],
  };

  const mockQueryRunner = {
    connect: vi.fn(),
    startTransaction: vi.fn(),
    commitTransaction: vi.fn(),
    rollbackTransaction: vi.fn(),
    release: vi.fn(),
    manager: {
      update: vi.fn().mockResolvedValue({}),
      findOne: vi.fn().mockResolvedValue(mockRecipe),
      create: vi.fn().mockImplementation((entity, dto) => dto),
      save: vi.fn().mockImplementation((entity, dto) => Array.isArray(dto) ? dto : { id: 2, ...dto }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        {
          provide: getRepositoryToken(Recipe),
          useValue: {
            find: vi.fn(),
            findOne: vi.fn().mockResolvedValue(mockRecipe),
            save: vi.fn(),
          },
        },
        {
          provide: getRepositoryToken(RecipeIngredient),
          useValue: {
            save: vi.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: vi.fn().mockReturnValue(mockQueryRunner),
          },
        },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
    recipeRepo = module.get<Repository<Recipe>>(getRepositoryToken(Recipe));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findActiveByProduct', () => {
    it('should return the active recipe', async () => {
      const result = await service.findActiveByProduct(1);
      expect(result).toEqual(mockRecipe);
      expect(recipeRepo.findOne).toHaveBeenCalledWith({
        where: { productId: 1, isActive: true, deshabilitado: false },
        relations: { product: true, ingredients: { product: true } },
      });
    });

    it('should throw if no active recipe', async () => {
      vi.spyOn(recipeRepo, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findActiveByProduct(1)).rejects.toThrow('No hay receta activa');
    });
  });

  describe('create', () => {
    it('should create a new recipe version in a transaction', async () => {
      const dto = {
        productId: 1,
        name: 'Latte v2',
        ingredients: [{ productId: 2, quantity: 1, unit: 'UNIT' }],
      };

      vi.spyOn(service, 'findOne').mockResolvedValueOnce({ ...mockRecipe, version: 2 } as any);

      const result = await service.create(dto);

      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.manager.update).toHaveBeenCalledWith(
        Recipe,
        { productId: 1, isActive: true },
        { isActive: false }
      );
      expect(mockQueryRunner.manager.save).toHaveBeenCalledTimes(2); // recipe + ingredients
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(result.version).toBe(2);
    });

    it('should rollback transaction on error', async () => {
      mockQueryRunner.manager.save.mockRejectedValueOnce(new Error('DB Error'));

      const dto = {
        productId: 1,
        name: 'Latte v2',
        ingredients: [],
      };

      await expect(service.create(dto)).rejects.toThrow('DB Error');
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });
});
