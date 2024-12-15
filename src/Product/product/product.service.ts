import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from 'src/DTOs/create-product.dto';
import { create } from 'domain';
import { UpdateProductDto } from 'src/DTOs/update-product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    //To create a Product
    async addProduct(createProductDto: CreateProductDto): Promise<Product>
    {
        const product = this.productRepository.create(createProductDto);
        return this.productRepository.save(product);
    }
 
    //To Update a Product
    async updateProduct(id: number, updateProductDto: UpdateProductDto ): Promise<Product>
    {
        await this.productRepository.update(id, updateProductDto);
        return this.productRepository.findOne({where: {id}});
    }

    //To Delete a Product
    async deleteProduct(id:number): Promise<void>
    {
        await this.productRepository.delete(id);
    }

    //To View a Product

    async viewProduct(id:number): Promise<Product>
    {
        return this.productRepository.findOne({where: {id}});
    }




  }