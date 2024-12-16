import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockMovement } from 'src/Inventory/stock-movement.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PerformanceService {
    constructor(
        @InjectRepository(StockMovement)
        private readonly stockMovementRepository: Repository<StockMovement>,  
    ){}

    //Total Sales
    async getSalesMetrics() {
        const totalRevenue = await this.stockMovementRepository.query(`
            SELECT SUM(sm."quantity" * p."price") AS "totalRevenue"
            FROM "stock_movements" sm
            JOIN "products" p ON p."id" = sm."productId"
            WHERE sm."type" = 'outbound'
        `);

        const totalUnitsSold = await this.stockMovementRepository.query(`
            SELECT SUM(sm."quantity") AS "totalUnitsSold"
            FROM "stock_movements" sm
            WHERE sm."type" = 'outbound'
        `);

        return {
            totalRevenue: totalRevenue[0]?.totalRevenue || 0, //No sales
            totalUnitsSold: totalUnitsSold[0]?.totalUnitsSold || 0,
        };
    }

    // Best-Selling Products
    async getBestSellingProducts(limit: number = 5) {
        return this.stockMovementRepository.query(`
            SELECT p."name", SUM(sm."quantity") AS "unitsSold", SUM(sm."quantity" * p."price") AS "revenue"
            FROM "stock_movements" sm
            JOIN "products" p ON p."id" = sm."productId"
            WHERE sm."type" = 'outbound'
            GROUP BY p."id"
            ORDER BY "unitsSold" DESC
            LIMIT $1
        `, [limit]);
    }

    // Sales Trends Over Time
    async getSalesTrends() {
        return this.stockMovementRepository.query(`
            SELECT DATE(sm."createdAt") AS "date", SUM(sm."quantity" * p."price") AS "dailyRevenue"
            FROM "stock_movements" sm
            JOIN "products" p ON p."id" = sm."productId"
            WHERE sm."type" = 'outbound'
            GROUP BY DATE(sm."createdAt")
            ORDER BY "date" ASC
        `);
    }
}
