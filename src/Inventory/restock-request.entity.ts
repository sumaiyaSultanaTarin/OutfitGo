import { Product } from "src/Product/product.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('restock_requests')
export class RestockRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, (product) => product.id, { onDelete: 'CASCADE' })
    product: Product;

    @Column('int')
    requestedQuantity: number;

    @Column({ default: 'Pending' })
    status: 'Pending' | 'Approved' | 'Rejected';

    @CreateDateColumn()
    createdAt: Date;
}
