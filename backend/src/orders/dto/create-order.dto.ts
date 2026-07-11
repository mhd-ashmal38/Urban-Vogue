import { IsString, IsNotEmpty, MinLength, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: '123 Main St, Apt 4B, New York, NY 10001' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  shippingAddress: string;

  @ApiProperty({ example: 'uuid-of-address', required: false })
  @IsString()
  @IsUUID()
  @IsOptional()
  addressId?: string;
}
