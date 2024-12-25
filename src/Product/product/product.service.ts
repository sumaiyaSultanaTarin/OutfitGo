import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product.entity';
import { Repository } from 'typeorm';
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
    const { variants, ...productData } = createProductDto;

    // Create and save the product
    const product = this.productRepository.create(productData);
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
    const { variants, ...productData } = updateProductDto;

    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['variants'],
    });
    if (!product) {
      throw new Error('Product not found');
    }

    // Update the product fields
    await this.productRepository.update(id, productData);

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
  }

  //To View a Product

  async viewProduct(id: number): Promise<Product> {
    return this.productRepository.findOne({ where: { id } });
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

        // Handle product variants (if provided)
        if (row.variants) {
          const variants = JSON.parse(row.variants); // Variants should be a JSON array in the file
          for (const variant of variants) {
            if (!variant.variantName || !variant.variantValue || !variant.stockLevel) {
              throw new Error(`Missing required fields for product variant: ${JSON.stringify(variant)}`);
            }

            const productVariant = this.productVariantRepository.create({
              product: savedProduct,
              variantName: variant.variantName,
              variantValue: variant.variantValue,
              stockLevel: parseInt(variant.stockLevel, 10),
            });

            await this.productVariantRepository.save(productVariant);
          }
        }

        // Extract vendor's email from token
    const vendorEmail = this.extractEmailFromAuthHeader(authHeader);

    // Send email notification
    await this.sendEmailNotification(vendorEmail, results, errors);

        results.push(savedProduct);
      } catch (error) {
        errors.push({ error: error.message, row });
      }
    }

    return {
      success: results.length,
      errors,
    };
  }

  private extractEmailFromAuthHeader(authHeader: string): string {
    if (!authHeader) {
      throw new BadRequestException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.decode(token) as any;
    if (!payload || !payload.email) {
      throw new BadRequestException('Invalid token: Email not found');
    }

    return payload.email;
  }

  private async sendEmailNotification(email: string, results: any[], errors: any[]): Promise<void> {
    const successCount = results.length;
    const errorCount = errors.length;

    const successMessage = successCount
      ? `${successCount} products were successfully uploaded.`
      : 'No products were successfully uploaded.';
    const errorMessage = errorCount
      ? `${errorCount} products had errors during the upload process.`
      : 'No errors were encountered.';

    const errorDetails = errors
      .map((err, index) => `Row ${index + 1}: ${err.error}`)
      .join('\n');

    console.log(`
      To: ${email}
      Subject: Bulk Upload Results
      Message:
      Bulk Upload Summary:
      ${successMessage}
      ${errorMessage}
      ${errorCount > 0 ? `Errors:\n${errorDetails}` : ''}
    `);

    // If integrating with a real email service, use a Mailer module here.
  }

  private async parseCSV(file: Express.Multer.File): Promise<any[]> {
    const results = [];
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

  async previewFile(file: Express.Multer.File): Promise<any> {
    const extension = path.extname(file.originalname).toLowerCase();
    if (extension !== '.csv' && extension !== '.xlsx') {
      throw new BadRequestException('Invalid file format. Only CSV or Excel files are allowed.');
    }
  
    const data = extension === '.csv' ? await this.parseCSV(file) : await this.parseExcel(file);
    return { preview: data.slice(0, 10) }; // Return the first 10 rows
  }
  

}
