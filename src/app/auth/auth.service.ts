import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { omit } from 'lodash';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(authDto: AuthDto): Promise<any> {
    const user = await this.userRepository.findOneBy({ email: authDto.email });
    const validPass = await bcrypt.compare(authDto.password, user.password);

    if (user && validPass) {
      const data = omit(user, [
        'email',
        'password',
        'created_at',
        'updated_at',
      ]);

      return {
        access_token: this.jwtService.sign(data),
        user: data,
      };
    }

    throw new UnauthorizedException('email and password does not match');
  }
}
