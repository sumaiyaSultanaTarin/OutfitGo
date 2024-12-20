import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, (product) => product.variants)
    product: Product; 

    @Column()
    variantName: string; 

    @Column()
    variantValue: string;

    @Column('int')
    stockLevel: number;

} 
