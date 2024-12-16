import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { UpdateOrderStatusDto } from 'src/DTOs/update-order-status.dto';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
    ){}

    async getAllOrders()
    {
        return this.orderRepository.find({
            relations: ['product'],
        });

    }

    async getOrderById(id: number)
    {
        return this.orderRepository.findOne({
            where: {id},
            relations: ['product'],
        });
    }

   async updateOrderStatus(id: number, status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancel') {
        const order = await this.getOrderById(id);
        if (!order) {
            throw new Error(`Order with ID ${id} not found`);
        }
        order.status = status;
        return this.orderRepository.save(order);
    }

    
}
