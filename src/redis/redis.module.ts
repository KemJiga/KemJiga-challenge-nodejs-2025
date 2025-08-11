import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('REDIS_HOST') || '127.0.0.1';
        const port = Number(configService.get('REDIS_PORT')) || 6379;
        const password = configService.get<string>('REDIS_PASSWORD');
        return new Redis({
          host,
          port,
          password: password || undefined,
          enableReadyCheck: true,
          maxRetriesPerRequest: 2,
        });
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

  async onModuleDestroy(): Promise<void> {
    try {
      await this.client.quit();
    } catch {
      /* ignore */
    }
  }
}
