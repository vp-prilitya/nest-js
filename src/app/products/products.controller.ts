import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/pages/dto/page-options.dto';
import { ApiPaginatedResponse } from 'src/common/pages/decorator/api-pagination.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorator/roles/roles.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('products')
@ApiTags('Products')
@ApiForbiddenResponse({ description: 'Unauthorized Request' })
@ApiResponse({ status: 500, description: 'Internal error' })
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles('staff')
  @Post()
  @ApiOperation({ summary: 'Create new product' })
  @ApiCreatedResponse({ description: 'Created Successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Roles('staff', 'customer')
  @Get()
  @ApiOperation({ summary: 'List all product' })
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(CreateProductDto)
  @ApiOkResponse({ description: 'The resources were returned successfully' })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.productsService.findAll(pageOptionsDto);
  }

  @Roles('staff')
  @Get(':id')
  @ApiOperation({ summary: 'Get product by Id' })
  @ApiOkResponse({ description: 'The resources were returned successfully' })
  @ApiNotFoundResponse({ description: 'Product Not Found' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Roles('staff')
  @Patch(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiCreatedResponse({ description: 'Created Successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Product Not Found' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Roles('staff')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  @ApiCreatedResponse({ description: 'Deleted Successfully' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
