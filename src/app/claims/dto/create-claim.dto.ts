import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Product } from 'src/app/products/entities/product.entity';

export class CreateClaimDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'This is a required property',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: Product,
  })
  product: Product;
}
