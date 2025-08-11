import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  PrimaryKey,
} from 'sequelize-typescript';
import { Order } from './order.entity';
import { InferAttributes, InferCreationAttributes } from 'sequelize';

@Table({
  tableName: 'order_items',
  timestamps: true,
})
export class OrderItem extends Model<
  InferAttributes<OrderItem>,
  InferCreationAttributes<OrderItem>
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
  declare description: string;

  @Column({
    type: DataType.INTEGER,
  })
  declare quantity: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  declare unitPrice: number;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
  })
  declare orderId: number;

  @BelongsTo(() => Order)
  declare order?: Order;

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
