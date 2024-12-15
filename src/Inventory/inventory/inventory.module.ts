import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovement } from '../stock-movement.entity';
import { RestockRequest } from '../restock-request.entity';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

@Module({
    imports: [TypeOrmModule.forFeature([StockMovement, RestockRequest])],
    controllers: [InventoryController],
    providers: [InventoryService],
})
export class InventoryModule {}
