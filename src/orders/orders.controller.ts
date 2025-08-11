import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderDeleteResponse, OrderResponse } from './common/responses';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(): Promise<OrderResponse[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<OrderResponse> {
    return this.ordersService.findById(id);
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponse> {
    return this.ordersService.create(createOrderDto);
  }

  @HttpCode(200)
  @Post(':id/advance')
  advanceOrderStatus(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrderResponse | OrderDeleteResponse> {
    return this.ordersService.advanceOrderStatus(id);
  }
}
