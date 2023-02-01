import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from '../../common/pages/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/pages/dto/page-options.dto';
import { PageDto } from '../../common/pages/dto/page.dto';
import { Repository } from 'typeorm';
import { CreateClaimDto } from './dto/create-claim.dto';
import { StatusDto } from './dto/status.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { Claim } from './entities/claim.entity';
import { GuardDto } from '../auth/dto/guard.dto';

@Injectable()
export class ClaimsService {
  constructor(
    @InjectRepository(Claim) private claimRepository: Repository<Claim>,
  ) {}

  async create(createClaimDto: CreateClaimDto, user: GuardDto) {
    const newClaim = this.claimRepository.create({
      customer: {
        id: user.id,
      },
      ...createClaimDto,
    });
    try {
      await this.claimRepository.insert(newClaim);

      return newClaim;
    } catch (err) {
      if (err?.code === '23503') {
        throw new BadRequestException('Product with that id already exists');
      }
    }
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.claimRepository.createQueryBuilder('claim');
    queryBuilder
      .orderBy('claim.created_at', pageOptionsDto.order)
      .leftJoin('claim.product', 'product')
      .leftJoin('claim.customer', 'customer')
      .addSelect([
        'product.id',
        'product.name',
        'product.description',
        'customer.id',
        'customer.name',
      ])
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .getOne();

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    const data = await this.claimRepository.findOne({
      where: { id },
      relations: {
        product: true,
        customer: true,
      },
      select: {
        product: {
          id: true,
          name: true,
        },
        customer: {
          id: true,
          name: true,
        },
      },
    });

    if (!data) {
      throw new NotFoundException(`Data id ${id} not found`);
    }

    return data;
  }

  async update(id: number, updateClaimDto: UpdateClaimDto) {
    const updateClaim = await this.claimRepository.findOneBy({ id });
    if (!updateClaim) {
      throw new NotFoundException(`Data Claim ${id} Not Found`);
    }
    try {
      updateClaim.description = updateClaimDto.description;
      updateClaim.product = updateClaimDto.product;

      return await this.claimRepository.save(updateClaim);
    } catch (err) {
      if (err?.code === '23503') {
        throw new BadRequestException('Product with that id already exists');
      }
    }
  }

  async remove(id: number) {
    const updateClaim = await this.claimRepository.findOneBy({ id });
    if (updateClaim) {
      await this.claimRepository.delete(id);

      return updateClaim;
    }

    throw new NotFoundException(`Data claim  ${id} Not Found`);
  }

  async updateStatus(id: number, statusDto: StatusDto) {
    const updateClaim = await this.claimRepository.findOneBy({ id });
    if (updateClaim) {
      updateClaim.status = statusDto.status === 'approve' ? true : false;
      return await this.claimRepository.save(updateClaim);
    }

    throw new NotFoundException(`Data claim  ${id} Not Found`);
  }
}
