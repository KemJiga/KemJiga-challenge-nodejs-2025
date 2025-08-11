import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../src/orders/orders.controller';
import { OrdersService } from '../src/orders/orders.service';
import { OrderStatus } from '../src/orders/common/enums';
import { OrderResponse } from 'src/orders/common/responses';
import { CreateOrderDto } from 'src/orders/dtos/create-order.dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: jest.Mocked<OrdersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            advanceOrderStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get(OrdersService);
  });

  it('GET /orders should return all orders', async () => {
    const findAllSpy = jest.spyOn(service, 'findAll');
    const data = [
      {
        id: 1,
        clientName: 'John',
        status: OrderStatus.INITIATED,
        total: 10,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    service.findAll.mockResolvedValueOnce(data as OrderResponse[]);

    const result = await controller.findAll();

    expect(result).toEqual(data);
    expect(findAllSpy).toHaveBeenCalled();
  });

  it('GET /orders/:id should return order', async () => {
    const findByIdSpy = jest.spyOn(service, 'findById');
    const data = {
      id: 2,
      clientName: 'Ana',
      status: OrderStatus.SENT,
      total: 20,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as OrderResponse;
    service.findById.mockResolvedValueOnce(data);

    const result = await controller.findById(2);

    expect(result).toEqual(data);
    expect(findByIdSpy).toHaveBeenCalledWith(2);
  });

  it('POST /orders should create order', async () => {
    const createSpy = jest.spyOn(service, 'create');
    const dto = {
      clientName: 'Bob',
      items: [{ description: 'Dish', quantity: 1, unitPrice: 10 }],
    } as CreateOrderDto;
    const created = {
      ...dto,
      id: 3,
      status: OrderStatus.INITIATED,
      total: 10,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as OrderResponse;
    service.create.mockResolvedValueOnce(created);

    const result = await controller.create(dto);

    expect(result).toEqual(created);
    expect(createSpy).toHaveBeenCalledWith(dto);
  });

  it('POST /orders/:id/advance should advance status or delete', async () => {
    const advanceSpy = jest.spyOn(service, 'advanceOrderStatus');
    const advanced = {
      id: 4,
      clientName: 'Carl',
      status: OrderStatus.SENT,
      total: 10,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as OrderResponse;
    service.advanceOrderStatus.mockResolvedValueOnce(advanced);

    const result = await controller.advanceOrderStatus(4);

    expect(result).toEqual(advanced);
    expect(advanceSpy).toHaveBeenCalledWith(4);
  });
});
