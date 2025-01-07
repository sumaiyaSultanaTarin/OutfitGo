import { Body, Controller, Get, Param, Patch, Post, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { LogStockMovementDto } from 'src/DTOs/log-stock-movement.dto';
import { CreateRestockRequestDto } from 'src/DTOs/create-restock-request.dto';
import { UpdateRestockRequestDto } from 'src/DTOs/update-restock-request.dto';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';


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

    @Get('export/csv')
    async exportInventoryAsCSV(@Res() res:Response) {
        const filePath = await this.inventoryService.exportInventoryAsCSV();
        res.download(filePath, 'inventory-report.csv', (err) => {
            if (err) {
                console.error('Error downloading CSV file:',err);
                res.status(500).send('Error downloading CSV file');
            }
        });
    }

    @Get('export/pdf')
    async exportInventoryAsPDF(@Res() res:Response) {
        const filePath = await this.inventoryService.exportInventoryAsPDF();
        res.download(filePath, 'inventory-report.pdf', (err) => {
            if (err) {
                console.error('Error downloading PDF file:',err);
                res.status(500).send('Error downloading PDF file');
            }
        });
    }

   
}
