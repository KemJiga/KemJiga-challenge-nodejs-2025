import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderItemDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  unitPrice: number;
}
