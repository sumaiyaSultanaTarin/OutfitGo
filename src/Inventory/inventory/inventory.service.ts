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
            SELECT SUM(p."price" * sm."quantity") AS "totalStockValue"
            FROM "public"."stock_movements" sm
            JOIN "public"."products" p ON p."id" = sm."productId"
            WHERE sm."type" = 'inbound';

            `),
            lowStockItems: await this.stockMovementRepository.query(`
            SELECT COUNT(*) AS "lowStockItems"
            FROM "public"."products"
            WHERE "stockLevel" < 10
            `)
        };
    }

    //To track and Record 
    async logStockMovement(productId: number, type: 'inbound' | 'outbound', quantity: number, notes?: string)
    {
        const StockMovement = this.stockMovementRepository.create({product:{id: productId}, type, quantity, notes});
        return this.stockMovementRepository.save(StockMovement);
    }

    //To create New Restock Request
    async createRestockRequest(productId: number, requestedQuantity: number) {
        const request = this.restockRequestRepository.create({ product: { id: productId }, requestedQuantity });
        return this.restockRequestRepository.save(request);
    }

    //To retrieve all the restock requests 
    async getRestockRequests() {
        return this.restockRequestRepository.find({ relations: ['product'] });
    }

    //To  update the status of a restock request
    async updateRestockRequest(id: number, status: 'Pending' | 'Approved' | 'Rejected') {
        await this.restockRequestRepository.update(id, { status });
        return this.restockRequestRepository.findOne({ where: { id }, relations: ['product'] });
    }
}
