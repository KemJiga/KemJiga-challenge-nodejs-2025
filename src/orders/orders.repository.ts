import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrderStatus } from './common/enums';
import { OrderDeleteResponse } from './common/responses';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(OrderItem)
    private readonly orderItemModel: typeof OrderItem,
  ) {}

  async findAll(): Promise<Order[]> {
    return await this.orderModel.findAll({
      where: { status: { [Op.ne]: OrderStatus.DELIVERED } },
      include: [OrderItem],
    });
  }

  async findById(id: number): Promise<Order | null> {
    return await this.orderModel.findByPk(id, {
      include: [OrderItem],
    });
  }

  async create(order: CreateOrderDto): Promise<Order> {
    const sequelize = this.orderModel.sequelize!;

    const newOrder = await sequelize.transaction(async (t) => {
      // Create the order
      const newOrder = await this.orderModel.create(
        {
          clientName: order.clientName,
          status: OrderStatus.INITIATED,
          total: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { transaction: t },
      );
      // Create order items
      const items = await Promise.all(
        order.items.map((item) =>
          this.orderItemModel.create(
            {
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              orderId: newOrder.id as number,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            { transaction: t },
          ),
        ),
      );
      // Update the total
      const total = items.reduce(
        (sum, item) => sum + Number(item.unitPrice) * item.quantity,
        0,
      );
      await newOrder.update({ total }, { transaction: t });

      // Reload the order with items to return complete data
      const reloadedOrder = await this.orderModel.findByPk(
        newOrder.id as number,
        {
          include: [OrderItem],
          transaction: t,
        },
      );

      if (!reloadedOrder) {
        throw new Error('Failed to create order');
      }

      return reloadedOrder;
    });

    return newOrder;
  }

  async advanceOrderStatus(id: number): Promise<Order | OrderDeleteResponse> {
    const order = await this.orderModel.findByPk(id, {
      include: [OrderItem],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.status === OrderStatus.INITIATED) {
      order.status = OrderStatus.SENT;
      await order.save();
    } else if (order.status === OrderStatus.SENT) {
      order.status = OrderStatus.DELIVERED;
      await order.save();
    } else if (order.status === OrderStatus.DELIVERED) {
      await order.destroy();
      return {
        status: 'deleted',
        message: 'Order deleted successfully',
      };
    } else {
      throw new BadRequestException('Invalid order status');
    }
    return order;
  }
}
