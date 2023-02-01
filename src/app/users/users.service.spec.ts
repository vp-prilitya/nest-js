import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((user) =>
        Promise.resolve({ id: Date.now(), ...user }),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('Register', () => {
    it('should create a new user record and return that', async () => {
      const user: CreateUserDto = {
        name: 'test',
        email: 'test@mail.com',
        password: '12345',
        role: 'staff',
        address: 'jakarta',
      };
      const create = await service.create(user);

      expect(create).toEqual({
        address: 'jakarta',
        email: 'test@mail.com',
        name: 'test',
        password: create.password,
        role: 'staff',
      });
    });
  });
});
