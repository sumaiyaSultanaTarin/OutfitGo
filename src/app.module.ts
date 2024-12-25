import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './Product/product/product.module';
import { InventoryModule } from './Inventory/inventory/inventory.module';
import { PerformanceModule } from './performance/performance.module';
import { StockMovement } from './Inventory/stock-movement.entity';
import { OrderModule } from './order/order.module';
import { Order } from './order/order.entity';
import { VendorModule } from './vendor/vendor.module';
import { Vendor } from './vendor/vendor.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Customer } from './customer.entity';
import { NotificationsService } from './notifications/notifications.service';
import path, { join } from 'path';
import * as fs from 'fs';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'tarin',
      database: '_OutfitGo',
      autoLoadEntities: true,
      entities: [StockMovement,Order,Vendor,Customer],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ProductModule, 
    InventoryModule,
    PerformanceModule,
    OrderModule,
    VendorModule,
    AuthModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  
}
