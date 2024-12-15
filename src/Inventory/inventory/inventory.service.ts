import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockMovement } from '../stock-movement.entity';
import { Repository } from 'typeorm';
import { RestockRequest } from '../restock-request.entity';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(StockMovement)
        private readonly stockMovementRepository: Repository<StockMovement>,
        @InjectRepository(RestockRequest)
        private readonly restockRequestRepository: Repository<RestockRequest>,
    ){}

    async getInventoryMetrics()
    {
        return{
            totalProducts: await this.stockMovementRepository.count(),
            totalStockValue: await this.stockMovementRepository.query(`
                SELECT SUM(p.price * sm.quantity) AS totalStockValue
                FROM stock_movements sm,
                JOIN products p ON p.id = sm.product_i
                WHERE sm.type = 'inbound'
            `),
            lowStockItems: await this.stockMovementRepository.query(`
                SELECT COUNT(*) AS losStokeItems
                FROM products
                WHERE sm.type = 'inbound'
            `)
        };
    }

    async logStockMovement(productId: number, type: 'inbound' | 'outbound', quantity: number, notes?: string)
    {
        const StockMovement = this.stockMovementRepository.create({product:{id: productId}, type, quantity, notes});
        return this.stockMovementRepository.save(StockMovement);
    }

    async createRestockRequest(productId: number, requestedQuantity: number) {
        const request = this.restockRequestRepository.create({ product: { id: productId }, requestedQuantity });
        return this.restockRequestRepository.save(request);
    }

    async getRestockRequests() {
        return this.restockRequestRepository.find({ relations: ['product'] });
    }

    async updateRestockRequest(id: number, status: 'Pending' | 'Approved' | 'Rejected') {
        await this.restockRequestRepository.update(id, { status });
        return this.restockRequestRepository.findOne({ where: { id }, relations: ['product'] });
    }
}
