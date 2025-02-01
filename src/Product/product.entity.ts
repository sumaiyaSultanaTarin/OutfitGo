import { StockMovement } from "src/Inventory/stock-movement.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProductVariant } from "./product-variant.entity";
import { Vendor } from "src/vendor/vendor.entity";

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

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    discount?: number; 

    @Column({ type: 'timestamp', nullable: true })
    discountStartDate?: Date;
  
    @Column({ type: 'timestamp', nullable: true })
    discountEndDate?: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => ProductVariant, (variant) => variant.product)
    variants: ProductVariant[];

   
}