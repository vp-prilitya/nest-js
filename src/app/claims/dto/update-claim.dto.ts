import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Product } from 'src/app/products/entities/product.entity';
import { CreateClaimDto } from './create-claim.dto';

export class UpdateClaimDto extends PartialType(CreateClaimDto) {
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
