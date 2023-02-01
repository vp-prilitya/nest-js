import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from '../../common/pages/dto/page-meta.dto';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PageOptionsDto } from '../../common/pages/dto/page-options.dto';
import { PageDto } from '../../common/pages/dto/page.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const newProduct = this.productRepository.create(createProductDto);
    await this.productRepository.insert(newProduct);

    return newProduct;
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    queryBuilder
      .orderBy('product.created_at', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    const data = await this.productRepository.findOneBy({ id });

    if (!data) {
      throw new NotFoundException(`Product id ${id} Not Found`);
    }
    return data;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const updateProduct = await this.productRepository.findOneBy({ id });
    if (!updateProduct) {
      throw new NotFoundException(`Product ${id} Not Found`);
    }
    try {
      updateProduct.name = updateProductDto.name;
      updateProduct.description = updateProductDto.description;

      return await this.productRepository.save(updateProduct);
    } catch (err) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async remove(id: number) {
    const updateProduct = await this.productRepository.findOneBy({ id });
    if (updateProduct) {
      await this.productRepository.delete(id);

      return updateProduct;
    }

    throw new NotFoundException(`Product ${id} Not Found`);
  }
}
