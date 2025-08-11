import {
  AutoIncrement,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../common/enums';
import { InferAttributes, InferCreationAttributes } from 'sequelize';

@Table({
  tableName: 'orders',
  timestamps: true,
})
export class Order extends Model<
  InferAttributes<Order>,
  InferCreationAttributes<Order>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare id?: number;

  @Column({
    type: DataType.STRING,
  })
  declare clientName: string;

  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
    defaultValue: OrderStatus.INITIATED,
    allowNull: false,
  })
  declare status: OrderStatus;

  @Column({
    type: DataType.FLOAT,
  })
  declare total: number;

  @HasMany(() => OrderItem)
  declare items?: OrderItem[];

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  declare updatedAt: Date;
}
