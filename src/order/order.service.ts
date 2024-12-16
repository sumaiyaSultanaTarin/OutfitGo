import { Injectable, NotFoundException } from '@nestjs/common';
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

    async getAllOrders(): Promise<Order[]>
    {
        return this.orderRepository.find({
            relations: ['product','customer'],
        });

    }

    async getOrderById(id: number): Promise<Order>
    {
        const order = await this.orderRepository.findOne({
            where: {id},
            relations: ['product','customer'],
        });

        if(!order)
        {
            throw new NotFoundException('Order Not Found');
        }

        return order;
    }

   async updateOrderStatus(id: number, status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancel'): Promise<Order> 
   {
        const order = await this.getOrderById(id);
        if (!order) {
            throw new Error(`Order with ID ${id} not found`);
        }
        order.status = status;
        return this.orderRepository.save(order);
    }

    
}
