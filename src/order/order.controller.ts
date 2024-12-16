import { Body, Controller, Get, Param, Patch, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderStatusDto } from 'src/DTOs/update-order-status.dto';
import { JwtAuthGuard } from 'src/jwt-auth.guard';

@UseGuards(JwtAuthGuard) // Protect this endpoint
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get()
    async getAllOrders() {
        return this.orderService.getAllOrders();
    }

    @Get(':id')
    async getOrderById(@Param('id') id: number) {
        return this.orderService.getOrderById(id);
    }



    @Patch(':id/status')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async updateOrderStatus(
        @Param('id') id: number,
        @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    ) {
        return this.orderService.updateOrderStatus(id, updateOrderStatusDto.status);
    }
}




