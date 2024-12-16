import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './Product/product/product.module';
import { InventoryModule } from './Inventory/inventory/inventory.module';
import { PerformanceModule } from './performance/performance.module';
import { StockMovement } from './Inventory/stock-movement.entity';

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
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
