import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { omit } from 'lodash';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const user: User = {
    id: 1,
    name: 'user test',
    email: 'test@mail.com',
    password: '12345',
    address: 'Jakarta',
    role: 'staff',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockAuthRepository = {
    findOneBy: jest.fn().mockImplementation(async () =>
      Promise.resolve({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockAuthRepository,
        },
      ],
      imports: [
        JwtModule.register({
          secretOrPrivateKey: 'Secret key',
        }),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should auth login', async () => {
    const authDto: AuthDto = {
      email: user.email,
      password: user.password,
    };
    const find = await service.login(authDto);
    const data = omit(user, ['email', 'password', 'created_at', 'updated_at']);

    expect(find).toEqual({
      access_token: jwtService.sign(data),
      user: data,
    });
  });
});
