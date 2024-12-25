import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductVariant } from '../product-variant.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([Product,ProductVariant]), JwtModule.register({})],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}
