import { Body, Controller, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { LogStockMovementDto } from 'src/DTOs/log-stock-movement.dto';
import { CreateRestockRequestDto } from 'src/DTOs/create-restock-request.dto';
import { UpdateRestockRequestDto } from 'src/DTOs/update-restock-request.dto';
import { JwtAuthGuard } from 'src/jwt-auth.guard';

@UseGuards(JwtAuthGuard) // Protect this endpoint
@Controller('inventory')
export class InventoryController {
    constructor(
        private readonly inventoryService: InventoryService
    ){}

    @Get('metrics')
    async getMetrics()
    {
        return this.inventoryService.getInventoryMetrics();
    }

    @Post('log')
    @UsePipes(new ValidationPipe({whitelist: true}))
    async logStockMovement(@Body() logStockMovementDto: LogStockMovementDto)
    {
        const {productId, type, quantity, notes} = logStockMovementDto;
        return this.inventoryService.logStockMovement(productId,type,quantity,notes);
    }

    @Post('restock')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async createRestockRequest(@Body() createRestockRequestDto: CreateRestockRequestDto) {
        const { productId, requestedQuantity } = createRestockRequestDto;
        return this.inventoryService.createRestockRequest(productId, requestedQuantity);
    }

    @Get('restock')
    async getRestockRequests()
    {
        return this.inventoryService.getRestockRequests();
    }

    @Patch('restock/:id')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async updateRestockRequestStatus(
        @Param('id') id: number,
        @Body() updateRestockRequestDto: UpdateRestockRequestDto,
    ) {
        const { status } = updateRestockRequestDto;
        return this.inventoryService.updateRestockRequest(id, status);
    }
}
