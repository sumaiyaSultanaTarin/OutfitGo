import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from 'src/DTOs/create-product.dto';
import { Product } from '../product.entity';
import { UpdateProductDto } from 'src/DTOs/update-product.dto';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { Response } from 'express';
import { Headers } from '@nestjs/common';


@UseGuards(JwtAuthGuard) // Protect this endpoint
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //Routing of Add
  @Post('create')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async addProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productService.addProduct(createProductDto);
  }

  //Routing of Update
  @Put('update/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct(id, updateProductDto);
  }

  //Routing of Delete
  @Delete('delete/:id')
  async deleteProduct(@Param('id') id: number): Promise<void> {
    return this.productService.deleteProduct(id);
  }

  @Get('view/:id')
  async viewProduct(@Param('id') id: number): Promise<Product> {
    return this.productService.viewProduct(id);
  }

  @Post('bulk-upload')
@UseInterceptors(FileInterceptor('file'))
async bulkUpload(
  @UploadedFile() file: Express.Multer.File,
  @Headers('authorization') authHeader: string,
) {
  if (!file) {
    throw new BadRequestException('No file uploaded');
  }

  if (!authHeader) {
    throw new BadRequestException('Authorization header is missing');
  }

  return this.productService.processFile(file, authHeader);
}

 
@Post('preview')
@UseInterceptors(FileInterceptor('file'))
async previewFile(@UploadedFile() file: Express.Multer.File) {
  if (!file) {
    throw new BadRequestException('No file uploaded');
  }
  return this.productService.previewFile(file);
}


 
  @Get('template')
  async downloadTemplate(@Res() res: Response) {
    try {
      await this.productService.downloadTemplate(res);
    } catch (err) {
      console.error('Error:', err.message);
      throw new BadRequestException('Could not download the template file.');
    }
  }
}
