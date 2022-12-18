import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseType } from 'typeorm';
import { ConfigModule } from '@nestjs/config';

import { Module } from '@nestjs/common';
// const dataBaseType: DatabaseType = process.env.DB_TYPE;

// console.log(process.env);
// const typeOrmConfig: TypeOrmModuleOptions = {};
// import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        let type: DatabaseType;
        let extra = null;
        switch (process.env.DB_TYPE) {
          case 'mysql':
            type = 'mysql';
            break;
          case 'postgres':
            type = 'postgres';
            extra = {
              ssl: process.env.NODE_ENV === 'production' ? false : true,
            };
            break;
          default:
            type = 'mysql';
        }
        // console.log(process.env);
        return {
          type,
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          entities: [__dirname + '/../**/*.entity.{js,ts}'],
          synchronize: process.env.NODE_ENV === 'production' ? false : true,
          timezone: '+07:00',
          logging: false,
          autoLoadEntities: true,
          extra,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
