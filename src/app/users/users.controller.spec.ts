import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  const mockUsersRepository = {
    create: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersRepository)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('Register User', () => {
    it('should create a user', () => {
      const user: CreateUserDto = {
        name: 'test',
        email: 'test@mail.com',
        password: '12345',
        role: 'staff',
        address: 'jakarta',
      };

      expect(controller.create(user)).toEqual({
        id: expect.any(Number),
        ...user,
      });

      expect(mockUsersRepository.create).toHaveBeenCalledWith(user);
    });
  });
});
