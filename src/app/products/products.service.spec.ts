import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PageMetaDto } from '../../common/pages/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/pages/dto/page-options.dto';
import { PageDto } from '../../common/pages/dto/page.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  const dataProducts: Product = {
    id: 1,
    name: 'test',
    description: 'desc test',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockProductsRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    insert: jest
      .fn()
      .mockImplementation((product) =>
        Promise.resolve({ id: Date.now(), ...product }),
      ),
    save: jest.fn().mockImplementation((data) => Promise.resolve({ ...data })),
    createQueryBuilder: jest.fn(() => ({
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(0),
      getRawAndEntities: jest.fn().mockReturnThis(),
      entities: [],
    })),
    findOneBy: jest
      .fn()
      .mockImplementation((id) => Promise.resolve({ id, ...dataProducts })),
    delete: jest
      .fn()
      .mockImplementation((id) => Promise.resolve({ id, ...dataProducts })),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should create a new product record and return that', async () => {
    const dto: CreateProductDto = {
      name: 'test product',
      description: 'desc product',
    };
    const create = await service.create(dto);

    expect(create).toEqual({
      ...dto,
    });
  });

  it('should find all products', async () => {
    const dto: PageOptionsDto = new PageOptionsDto();
    const find = await service.findAll(dto);
    const dt = new PageDto(
      [],
      new PageMetaDto({
        itemCount: 0,
        pageOptionsDto: dto,
      }),
    );
    expect(find).toEqual(dt);
  });

  it('should find one products by Id', async () => {
    const find = await service.findOne(1);

    expect(find).toEqual({ ...dataProducts });
  });

  it('should update one products by Id', async () => {
    const dto: UpdateProductDto = {
      name: 'test product update',
      description: 'desc product update',
    };
    const update = await service.update(1, dto);

    expect(update).toEqual({
      id: expect.any(Number),
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      ...dto,
    });
  });

  it('should delete one products by Id', async () => {
    const update = await service.remove(1);

    expect(update).toEqual({
      id: 1,
      ...dataProducts,
    });
  });
});
