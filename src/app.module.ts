import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { UsersModule } from './users/users.module';
import { SizesModule } from './sizes/sizes.module';
import { CategoriesModule } from './categories/categories.module';
import { AddressModule } from './address/address.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),

    AuthModule,

    ProductModule,

    UsersModule,

    SizesModule,

    CategoriesModule,

    AddressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
