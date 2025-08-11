import { registerAs } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

export default registerAs('sequelize', (): SequelizeModuleOptions => {
  const configService = new ConfigService();
  const port = Number(configService.get('DB_PORT')) || 5432;

  return {
    dialect: 'postgres',
    host: configService.get('DB_HOST'),
    port,
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    autoLoadModels: true,
    synchronize: true,
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  };
});
