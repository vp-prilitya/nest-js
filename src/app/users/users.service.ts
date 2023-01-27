import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashPass = await bcrypt.hash(createUserDto.password, 10);

    try {
      const newUser = this.userRepository.create({
        ...createUserDto,
        password: hashPass,
      });
      await this.userRepository.save(newUser);
      return newUser;
    } catch (err) {
      if (err?.code === '23505') {
        throw new BadRequestException('User with that email already exists');
      }
    }
  }
}
