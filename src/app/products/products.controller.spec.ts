import { Test, TestingModule } from '@nestjs/testing';
import { PageMetaDto } from '../../common/pages/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/pages/dto/page-options.dto';
import { PageDto } from '../../common/pages/dto/page.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  const dataProducts: Product = {
    id: 1,
    name: 'test',
    description: 'desc test',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockUsersRepository = {
    create: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
    update: jest.fn().mockImplementation((id, dto) => ({
      id,
      ...dto,
    })),
    findOne: jest.fn().mockImplementation((id) => ({
      id,
      ...dataProducts,
    })),
    findAll: jest.fn((dto) => {
      return new PageDto(
        [],
        new PageMetaDto({
          itemCount: 0,
          pageOptionsDto: dto,
        }),
      );
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    })
      .overrideProvider(ProductsService)
      .useValue(mockUsersRepository)
      .compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should create new products', () => {
    const dto: CreateProductDto = {
      name: 'test product',
      description: 'test description',
    };

    expect(controller.create(dto)).toEqual({ id: expect.any(Number), ...dto });
    expect(mockUsersRepository.create).toHaveBeenCalledWith(dto);
  });

  it('should get a list of product', async () => {
    const dto: PageOptionsDto = new PageOptionsDto();
    const dt = new PageDto(
      [],
      new PageMetaDto({
        itemCount: 0,
        pageOptionsDto: dto,
      }),
    );
    expect(await controller.findAll(dto)).toEqual({ ...dt });
    expect(mockUsersRepository.findAll).toHaveBeenCalled();
  });

  it('should get a one of product', () => {
    expect(controller.findOne('1')).toEqual({
      ...dataProducts,
    });
    expect(mockUsersRepository.findOne).toHaveBeenCalled();
  });

  it('should update a products', () => {
    const dto: UpdateProductDto = {
      name: 'test',
      description: 'test decs',
    };

    expect(controller.update('1', dto)).toEqual({
      id: 1,
      ...dto,
    });

    expect(mockUsersRepository.update).toHaveBeenCalled();
  });
});
