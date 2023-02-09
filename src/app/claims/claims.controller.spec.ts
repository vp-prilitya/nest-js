import { Test, TestingModule } from '@nestjs/testing';
import { PageMetaDto } from '../../common/pages/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/pages/dto/page-options.dto';
import { PageDto } from '../../common/pages/dto/page.dto';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { Claim } from './entities/claim.entity';

describe('ClaimsController', () => {
  let controller: ClaimsController;
  const dataClaim: Claim = {
    id: 1,
    description: 'test claim',
    product: new Product(),
    customer: new User(),
    status: null,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockClaimRepository = {
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
      ...dataClaim,
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
      controllers: [ClaimsController],
      providers: [ClaimsService],
    })
      .overrideProvider(ClaimsService)
      .useValue(mockClaimRepository)
      .compile();

    controller = module.get<ClaimsController>(ClaimsController);
  });

  it('should create new claim', () => {
    const dto: CreateClaimDto = {
      description: 'test claim description',
      product: new Product(),
    };

    const guard = {
      id: 1,
      name: 'user',
      address: 'Jakarta',
      role: 'customer',
    };

    expect(controller.create(guard, dto)).toEqual({
      id: expect.any(Number),
      ...dto,
    });
    // expect(mockClaimRepository.create).toHaveBeenCalledWith(dto);
  });

  it('should get a list of claim', async () => {
    const dto: PageOptionsDto = new PageOptionsDto();
    const dt = new PageDto(
      [],
      new PageMetaDto({
        itemCount: 0,
        pageOptionsDto: dto,
      }),
    );
    expect(await controller.findAll(dto)).toEqual({ ...dt });
    expect(mockClaimRepository.findAll).toHaveBeenCalled();
  });

  it('should get a one of claim', () => {
    expect(controller.findOne('1')).toEqual({
      ...dataClaim,
    });
    expect(mockClaimRepository.findOne).toHaveBeenCalled();
  });

  it('should update a claim', () => {
    const dto: UpdateClaimDto = {
      description: 'test decs',
      product: new Product(),
    };

    expect(controller.update('1', dto)).toEqual({
      id: 1,
      ...dto,
    });

    expect(mockClaimRepository.update).toHaveBeenCalled();
  });
});
