import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateItemDto {
  @ApiProperty({ example: 2, minimum: 1, required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  quantity?: number;
}
