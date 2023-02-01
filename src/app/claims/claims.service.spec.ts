import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PageMetaDto } from '../../common/pages/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/pages/dto/page-options.dto';
import { PageDto } from '../../common/pages/dto/page.dto';
import { GuardDto } from '../auth/dto/guard.dto';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { ClaimsService } from './claims.service';
import { Status } from './constants/status.constant';
import { CreateClaimDto } from './dto/create-claim.dto';
import { StatusDto } from './dto/status.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { Claim } from './entities/claim.entity';

describe('ClaimsService', () => {
  let service: ClaimsService;
  const dataClaim: Claim = {
    id: 1,
    description: 'test claim',
    product: new Product(),
    customer: new User(),
    status: null,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const dataProducts: Product = {
    id: 1,
    name: 'test product',
    description: 'desc test',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockClaimRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    insert: jest
      .fn()
      .mockImplementation((claim) =>
        Promise.resolve({ id: Date.now(), ...claim }),
      ),
    save: jest.fn().mockImplementation((data) => Promise.resolve({ ...data })),
    createQueryBuilder: jest.fn(() => ({
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(0),
      getRawAndEntities: jest.fn().mockReturnThis(),
      entities: [],
    })),
    findOneBy: jest
      .fn()
      .mockImplementation((id) => Promise.resolve({ id, ...dataClaim })),
    findOne: jest
      .fn()
      .mockImplementation((id) => Promise.resolve({ id, ...dataClaim })),
    delete: jest
      .fn()
      .mockImplementation((id) => Promise.resolve({ id, ...dataClaim })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClaimsService,
        {
          provide: getRepositoryToken(Claim),
          useValue: mockClaimRepository,
        },
      ],
    }).compile();

    service = module.get<ClaimsService>(ClaimsService);
  });

  it('should create a new claim record and return that', async () => {
    const dto: CreateClaimDto = {
      description: 'desc claim',
      product: dataProducts,
    };

    const dtoGuard: GuardDto = {
      id: 1,
      name: 'user',
      address: 'jakarta',
      role: 'customer',
    };

    const create = await service.create(dto, dtoGuard);

    expect(create).toEqual({
      customer: {
        id: dtoGuard.id,
      },
      ...dto,
    });
  });

  it('should find all claim', async () => {
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

  it('should find one claim by Id', async () => {
    const find = await service.findOne(1);

    expect(find).toEqual({ ...dataClaim });
  });

  it('should update one claim by Id', async () => {
    const dto: UpdateClaimDto = {
      product: dataProducts,
      description: 'desc product update',
    };
    const update = await service.update(1, dto);

    expect(update).toEqual({
      id: expect.any(Number),
      status: null,
      customer: new User(),
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      ...dto,
    });
  });

  it('should delete one claim by Id', async () => {
    const update = await service.remove(1);

    expect(update).toEqual({
      id: 1,
      ...dataClaim,
    });
  });

  it('should update status claim', async () => {
    const status: StatusDto = {
      status: Status.approve,
    };
    const update = await service.updateStatus(1, status);

    expect(update).toEqual({ ...dataClaim, status: true });
  });
});
