import { Customer } from "src/customer.entity";
import { Product } from "src/Product/product.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('orders')
export class Order{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, (product) => product.id, {onDelete: 'CASCADE'}) //child entities will be deleted
    product: Product;

    @ManyToOne(() => Customer, (customer) => customer.id, { onDelete: 'CASCADE' })
    customer: Customer;

    @Column({length: 255})
    customerName: string;

    @Column('int')
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    totalPrice: number;

    @Column({length:50, default:'Pending'})
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancel' ;
    
    @CreateDateColumn()
    createdAt: Date;


}