import { StockMovement } from "src/Inventory/stock-movement.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('products')
export class Product{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 255})
    name: string;

    @Column({type:'text', nullable:true})
    description?: string;

    @Column('decimal', {precision: 10, scale: 2})
    price: number;

    @Column('int')
    stockLevel: number;

    @Column({length: 100, nullable:true})
    category?: string;

    @Column()
    vendorId: number;

    @Column({nullable:true})
    imageUrl?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;


}