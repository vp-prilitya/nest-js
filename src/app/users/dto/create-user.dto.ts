import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public password: string;

  @ApiProperty({
    enum: { customer: 'customer', staff: 'staff' },
  })
  @IsEnum({
    customer: 'customer',
    staff: 'staff',
  })
  @IsNotEmpty()
  public role: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  public address: string;
}
