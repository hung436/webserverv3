import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { UsersModule } from './users/users.module';
import { SizesModule } from './sizes/sizes.module';
import { CategoriesModule } from './categories/categories.module';
import { AddressModule } from './address/address.module';
import { RolesGuard } from './common/guards/roles.guard';
import { AccessTokenGuard } from './common/guards/accessToken.guard';
import { AccessTokenStrategy } from './auth/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './auth/strategies/refreshToken.strategy';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { ConfigsModule } from './config/ConfigsModule';
import { OrderModule } from './order/order.module';
import { GeneralModule } from './general/general.module';

@Module({
  imports: [
    ConfigsModule,
    DatabaseModule,

    AuthModule,

    ProductModule,

    UsersModule,

    SizesModule,

    CategoriesModule,

    AddressModule,
    CloudinaryModule,
    OrderModule,
    GeneralModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RolesGuard,
    AccessTokenGuard,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AppModule {}
