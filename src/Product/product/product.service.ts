import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product.entity';
import { ILike, Like, Repository } from 'typeorm';
import { CreateProductDto } from 'src/DTOs/create-product.dto';
import { UpdateProductDto } from 'src/DTOs/update-product.dto';
import { ProductVariant } from '../product-variant.entity';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import * as xlsx from 'xlsx';
import * as path from 'path';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
    private readonly jwtService: JwtService,
  ) {}

  async addProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { variants,discount,discountStartDate,discountEndDate, ...productData } = createProductDto;

    // Create and save the product
    const product = this.productRepository.create({
      ...productData,
      discount: discount || null,
      discountStartDate: discount ? new Date(discountStartDate) : null,
      discountEndDate: discount ? new Date(discountEndDate) : null,
    });    
    const savedProduct = await this.productRepository.save(product);

    // Save variants if they exist
    if (variants && variants.length > 0) {
      const productVariants = variants.map((variant) => ({
        ...variant,
        product: savedProduct,
      }));
      await this.productVariantRepository.save(productVariants);
    }

    // The saved product with its variants
    return this.productRepository.findOne({
      where: { id: savedProduct.id },
      relations: ['variants'],
    });
  }

  //To Update a Product
  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const { variants, discount, discountStartDate, discountEndDate, ...productData } = updateProductDto;

    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['variants'],
    });
    if (!product) {
      throw new Error('Product not found');
    }
    if(discount && (!discountStartDate || !discountEndDate))
    {
      throw new Error('Discount start and end dates are required when applying a discount.')
    }

    Object.assign(product, productData, {
      discount: discount || null,
      discountStartDate: discount ? new Date(discountStartDate) : null,
      discountEndDate: discount ? new Date(discountEndDate) : null,
    });

    await this.productRepository.save(product);

    if (variants && variants.length > 0) {
      await this.productVariantRepository.delete({ product: { id } });

      // Add the new variants
      const newVariants = variants.map((variant) => ({
        ...variant,
        product,
      }));
      await this.productVariantRepository.save(newVariants);
    }

    // Return the updated product with its variants
    return this.productRepository.findOne({
      where: { id },
      relations: ['variants'],
    });
  }

  //To Delete a Product
  async deleteProduct(id: number): Promise<void> {
    await this.productVariantRepository.delete({ product: { id } });
    await this.productRepository.delete(id);
    await this.productVariantRepository.delete(id);
  }

  //To View a Product

  async viewProduct(id: number): Promise<Product> {
    return this.productRepository.findOne({ where: { id },relations: ['variants'] });
  }

  async getAllProducts(page: number = 1, limit: number = 10): Promise<{products: Product[]; totalPages: number}> {
    const now = new Date();
    const offset = (page - 1) * limit;

    const [products, total] = await this.productRepository.findAndCount({
      relations: ['variants'],
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });

    const fProducts = products.map((product) => {
      const isDiscountActive = product.discount && product.discountStartDate && product.discountEndDate
        ? now >= new Date(product.discountStartDate) && now <= new Date(product.discountEndDate)
        : false;

      return {
        ...product,
        discountedPrice: product.discount && isDiscountActive
          ? product.price - (product.price * product.discount) / 100
          : product.price,
      };

    });

    return{
      products : fProducts,
      totalPages : Math.ceil(total/limit),
    }
  }

  //Search By Name
  async productByName(name: string, page: number = 1, limit: number = 10): Promise<{ products: Product[], totalPages: number }> {
    const [products, total] = await this.productRepository.findAndCount({
        where: { name: ILike(`%${name}%`) },
        take: limit,
        skip: (page - 1) * limit,
        relations: ['variants'],
    });

    return {
        products,
        totalPages: Math.ceil(total / limit),
    };
}


  async applyCategoryDiscount(category: string, discount: number, startDate?: Date, endDate?: Date): Promise<void> {
    const products = await this.productRepository.find({ where: { category } });
    for (const product of products) {
      product.discount = product.price - (product.price * (discount / 100));
      product.discountStartDate = startDate;
      product.discountEndDate = endDate;
      await this.productRepository.save(product);
  }
  }
  

  //Bulk Upload
  async processFile(file: Express.Multer.File, authHeader: string): Promise<any> {
    const extension = path.extname(file.originalname).toLowerCase();
    if (extension !== '.csv' && extension !== '.xlsx') {
      throw new BadRequestException('Invalid file format. Only CSV or Excel files are allowed.');
    }

    const data = extension === '.csv' ? await this.parseCSV(file) : await this.parseExcel(file);
    const results = [];
    const errors = [];

    for (const row of data) {
      try {
        // Validate required fields
        if (!row.name || !row.price || !row.stockLevel || !row.vendorId) {
          throw new Error(`Missing required fields for product: ${JSON.stringify(row)}`);
        }

        // Create and save the product
        const product = this.productRepository.create({
          name: row.name,
          description: row.description || '',
          price: parseFloat(row.price),
          stockLevel: parseInt(row.stockLevel, 10),
          category: row.category || null,
          vendorId: parseInt(row.vendorId, 10),
          imageUrl: row.imageUrl || null,
        });

      const savedProduct = await this.productRepository.save(product);
      results.push(savedProduct);


   
    }catch(err)
    {
      errors.push({err : err.message, row})
    }

    return {
      success: results.length,
      errors,
    };
  }
  }

  private async parseCSV(file: Express.Multer.File): Promise<any[]> {
    const results: any[] = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(file.path)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }

  private async parseExcel(file: Express.Multer.File): Promise<any[]> {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet);
  }


  async downloadTemplate(res: Response) {
    const filePath = path.join(process.cwd(), 'public', 'product.xlsx'); 

    if (!fs.existsSync(filePath)) {
      console.error('File not found at:', filePath);
      throw new Error('Template file not found');
    }

  
    res.download(filePath, 'product.xlsx', (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        throw new Error('Error downloading file');
      }
    });
  }

 

}
