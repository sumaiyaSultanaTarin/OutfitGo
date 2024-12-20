import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from 'src/DTOs/create-product.dto';
import { Product } from '../product.entity';
import { UpdateProductDto } from 'src/DTOs/update-product.dto';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';  // To handle file uploads


@UseGuards(JwtAuthGuard) // Protect this endpoint
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService)
    {
    }

        // Endpoint to handle bulk product upload
        @Post('upload-bulk')
        @UseInterceptors(FileInterceptor('file', {
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, './uploads');  // Directory to store the uploaded files
                },
                filename: (req, file, cb) => {
                    cb(null, `${Date.now()}-${file.originalname}`);  // File name with timestamp to avoid conflicts
                }
            }),
        }))
        async uploadBulkProducts(@UploadedFile() file: Express.Multer.File): Promise<string> {
            const products = await this.productService.processCSV(file.path);  // Process the CSV file
            return `Successfully uploaded ${products.length} products.`;
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

