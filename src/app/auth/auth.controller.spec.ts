import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { GuardDto } from './dto/guard.dto';

describe('AuthController', () => {
  let controller: AuthController;
  const guard: GuardDto = {
    id: 1,
    name: 'user',
    address: 'jakarta',
    role: 'customer',
  };

  const dto: AuthDto = {
    email: 'test@mail.com',
    password: '123456',
  };

  const mockAuthRepository = {
    login: jest.fn(() => {
      return {
        access_token: '',
        user: { ...guard },
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthRepository)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should auth login', async () => {
    expect(await controller.login(dto)).toEqual({
      access_token: '',
      user: { ...guard },
    });
    expect(mockAuthRepository.login).toHaveBeenCalledWith(dto);
  });
});
