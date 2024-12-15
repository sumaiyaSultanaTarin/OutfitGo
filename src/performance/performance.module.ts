import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformanceController } from './performance.controller';
import { PerformanceService } from './performance.service';
import { StockMovement } from 'src/Inventory/stock-movement.entity';

@Module({
    imports: [TypeOrmModule.forFeature([StockMovement])],
    controllers: [PerformanceController],
    providers: [PerformanceService],
})
export class PerformanceModule {}
