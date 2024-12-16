import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { JwtAuthGuard } from 'src/jwt-auth.guard';


@UseGuards(JwtAuthGuard) // Protect this endpoint
@Controller('performance')
export class PerformanceController {
    constructor(private readonly performanceService: PerformanceService) {}

    // Get Sales Metrics
    @Get('metrics')
    async getMetrics() {
        return this.performanceService.getSalesMetrics();
    }

    // Get Best-Selling Products
    @Get('best-sellers')
    async getBestSellingProducts(@Query('limit') limit: number = 5) {
        return this.performanceService.getBestSellingProducts(limit);
    }

    // Get Sales Trends
    @Get('trends')
    async getSalesTrends() {
        return this.performanceService.getSalesTrends();
    }
}
