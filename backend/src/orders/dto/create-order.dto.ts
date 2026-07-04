import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: '123 Main St, Apt 4B, New York, NY 10001' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  shippingAddress: string;
}
