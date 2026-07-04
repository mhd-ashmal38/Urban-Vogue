import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddItemDto {
  @ApiProperty({ example: 'uuid' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 'M', required: false })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiProperty({ example: 'Red', required: false })
  @IsString()
  @IsOptional()
  color?: string;
}
