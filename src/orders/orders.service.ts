import {
  Injectable,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateOrderDto } from './dtos/create-order.dto';
import { Order } from './entities/order.entity';
import { OrdersRepository } from './orders.repository';
import type Redis from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.module';
import {
  OrderResponse,
  OrderItemResponse,
  OrderDeleteResponse,
} from './common/responses';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private configService: ConfigService,
  ) {}

  async findAll(): Promise<OrderResponse[]> {
    const key = 'orders:active';
    const cached = await this.redis.get(key);
    if (cached) return JSON.parse(cached) as OrderResponse[];

    const orders = await this.ordersRepository.findAll();
    const mappedOrders = orders.map((order) => this.mapOrderToResponse(order));

    const ttl = Number(this.configService.get('CACHE_TTL')) || 30;
    await this.redis.setex(key, ttl, JSON.stringify(mappedOrders));

    return mappedOrders;
  }

  async findById(id: number): Promise<OrderResponse> {
    const key = `order:${id}`;
    const cached = await this.redis.get(key);
    if (cached) return JSON.parse(cached) as OrderResponse;
    const order = await this.ordersRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    const mappedOrder = this.mapOrderToResponse(order);
    const ttl = Number(this.configService.get('CACHE_TTL')) || 30;
    await this.redis.setex(key, ttl, JSON.stringify(mappedOrder));
    return mappedOrder;
  }

  async create(order: CreateOrderDto): Promise<OrderResponse> {
    try {
      const newOrder = await this.ordersRepository.create(order);
      await this.redis.del('orders:active');
      return this.mapOrderToResponse(newOrder);
    } catch {
      throw new InternalServerErrorException('Failed to create order');
    }
  }

  async advanceOrderStatus(
    id: number,
  ): Promise<OrderResponse | OrderDeleteResponse> {
    const order = await this.ordersRepository.advanceOrderStatus(id);
    await this.redis.del('orders:active');
    await this.redis.del(`order:${id}`);
    if (order.status === 'deleted') {
      return order;
    }
    return this.mapOrderToResponse(order);
  }

  private mapOrderToResponse(order: Order): OrderResponse {
    if (!order.items) {
      order.items = [];
    }
    const items = order.items.map((item) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })) as OrderItemResponse[];
    return {
      id: order.id as number,
      clientName: order.clientName,
      status: order.status,
      total: order.total,
      items,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }
}
