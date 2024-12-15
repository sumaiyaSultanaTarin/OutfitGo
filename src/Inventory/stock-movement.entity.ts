import { Product } from "src/Product/product.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('stock_movements')
export class StockMovement{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, (product) => product.id, { onDelete: 'CASCADE' })
    product: Product;

    @Column()
    type: 'inbound' | 'outbound';

    @Column('int')
    quantity: number;

    @Column({ nullable: true })
    notes?: string;

    @CreateDateColumn()
    createdAt: Date;
}