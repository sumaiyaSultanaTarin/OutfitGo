import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from 'src/DTOs/create-product.dto';
import { Product } from '../product.entity';
import { UpdateProductDto } from 'src/DTOs/update-product.dto';
import { JwtAuthGuard } from 'src/jwt-auth.guard';


@UseGuards(JwtAuthGuard) // Protect this endpoint
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService)
    {
    }

    //Routing of Add
    @Post('create')
    @UsePipes(new ValidationPipe({whitelist: true}))
    async addProduct(@Body() createProductDto: CreateProductDto): Promise<Product>
    {
        return this.productService.addProduct(createProductDto);
    }

    //Routing of Update
    @Put('update/:id')
    @UsePipes(new ValidationPipe({whitelist: true}))
    async updateProduct(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto): Promise<Product>
    {
        return this.productService.updateProduct(id, updateProductDto);
    }

    //Routing of Delete
    @Delete('delete/:id')
    async deleteProduct(@Param('id')id: number): Promise<void>
    {
        return this.productService.deleteProduct(id);
    }

    @Get('view/:id')
    async viewProduct(@Param('id')id: number): Promise<Product>
    {
        return this.productService.viewProduct(id);
    }



}

