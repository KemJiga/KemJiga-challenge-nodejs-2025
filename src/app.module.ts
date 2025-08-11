import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import sequelizeConfig from './database/sequelize';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
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
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        password: configService.get('REDIS_PASSWORD'),
        ttl: 30,
        db: 0,
      }),
      inject: [ConfigService],
    }),
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
