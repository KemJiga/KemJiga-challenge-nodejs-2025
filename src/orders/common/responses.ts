import { OrderStatus } from './enums';

export interface OrderItemResponse {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderResponse {
  id: number;
  clientName: string;
  status: OrderStatus;
  total: number;
  items: OrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderDeleteResponse {
  status: 'deleted';
  message: string;
}
