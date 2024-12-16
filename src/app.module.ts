import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './Product/product/product.module';
import { InventoryModule } from './Inventory/inventory/inventory.module';
import { PerformanceModule } from './performance/performance.module';
import { StockMovement } from './Inventory/stock-movement.entity';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { OrderModule } from './order/order.module';

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
      entities: [StockMovement],
      synchronize: true,
    }),
    ProductModule, 
    InventoryModule,
    PerformanceModule,
    OrderModule,
    
  ],
  controllers: [AppController, OrderController],
  providers: [AppService, OrderService],
})
export class AppModule {}
