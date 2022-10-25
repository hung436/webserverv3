import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.RDS_HOSTNAME || 'localhost',
  port: 3306,
  username: process.env.RDS_USERNAME || 'root',
  password: process.env.RDS_PASSWORD || '',
  database: process.env.RDS_DB_NAME || 'webappv3',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
  timezone: '+07:00',
  autoLoadEntities: true,
};
