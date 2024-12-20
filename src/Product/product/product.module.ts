import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductVariant } from '../product-variant.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Product,ProductVariant])],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}
