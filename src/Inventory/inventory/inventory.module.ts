import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovement } from '../stock-movement.entity';
import { RestockRequest } from '../restock-request.entity';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { Product } from 'src/Product/product.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { OrderService } from 'src/order/order.service';
import { OrderController } from 'src/order/order.controller';
import { Order } from 'src/order/order.entity';

@Module({
    imports: [TypeOrmModule.forFeature([StockMovement, RestockRequest,Product,Order])],
    controllers: [InventoryController,OrderController],
    providers: [InventoryService,NotificationsService,OrderService],
})
export class InventoryModule {}
