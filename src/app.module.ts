import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './Product/product/product.module';
import { InventoryModule } from './Inventory/inventory/inventory.module';
import { PerformanceController } from './performance/performance.controller';
import { PerformanceService } from './performance/performance.service';
import { PerformanceModule } from './performance/performance.module';
import { InventoryController } from './Inventory/inventory/inventory.controller';
import { InventoryService } from './Inventory/inventory/inventory.service';

@Module({
  imports: [ProductModule, InventoryModule,PerformanceModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'tarin',
      database: '_OutfitGo',
      autoLoadEntities: true,
      synchronize: true,
    }),
    
  ],
  controllers: [AppController, PerformanceController,InventoryController],
  providers: [AppService, PerformanceService,InventoryService],
})
export class AppModule {}
