import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/order/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
    ) {}

    // Notify logic for order updates
    notifyOrderUpdate(orderId: number, status: string) {
        console.log(`Order #${orderId} status updated to ${status}`);
    }

    // To fetch an order by ID
    async getOrderById(id: number): Promise<Order> {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order) {
            throw new Error(`Order with ID ${id} not found`);
        }
        return order;
    }

    // To update an order's status
    async updateOrderStatus(id: number, status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancel'): Promise<Order> {
        const order = await this.getOrderById(id); 
        order.status = status; 
        const updatedOrder = await this.orderRepository.save(order); 
        this.notifyOrderUpdate(order.id, order.status); // Trigger notification
        return updatedOrder; 
    }

    notifyLowStock(productId: number, stockLevel: number) {
        console.log(`Product #${productId} is low on stock. Current stock: ${stockLevel}`);
        // Real notification logic (e.g., email) can go here
    }
    
    
}
