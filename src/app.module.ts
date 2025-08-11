import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import sequelizeConfig from './database/sequelize';
import { RedisModule } from './redis/redis.module';
import { OrdersModule } from './orders/orders.module';
import { Sequelize } from 'sequelize-typescript';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: sequelizeConfig,
    }),
    RedisModule,
    OrdersModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly sequelize: Sequelize) {}
  async onModuleInit() {
    try {
      await this.sequelize.authenticate();
      console.log('Sequelize connected to DB');
    } catch (err) {
      console.error('Sequelize failed to connect:', err);
    }
  }
}
