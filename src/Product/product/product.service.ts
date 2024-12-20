import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from 'src/DTOs/create-product.dto';
import { create } from 'domain';
import { UpdateProductDto } from 'src/DTOs/update-product.dto';
import { ProductVariant } from '../product-variant.entity';
import { ProductVariantDto } from 'src/DTOs/product-variant.dto';
import * as fs from 'fs';
import * as csv from 'csv-parser';  // CSV parser
import * as path from 'path';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(ProductVariant)
        private readonly productVariantRepository: Repository<ProductVariant>,
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
    async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
        const { variants, ...productData } = updateProductDto;
    
        const product = await this.productRepository.findOne({ where: { id }, relations: ['variants'] });
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
    async deleteProduct(id:number): Promise<void>
    {
        await this.productVariantRepository.delete({ product: { id } });
        await this.productRepository.delete(id);
    }

    //To View a Product

    async viewProduct(id:number): Promise<Product>
    {
        return this.productRepository.findOne({where: {id}});
    }


     // Bulk Product Upload (Process CSV File)
     async processCSV(filePath: string): Promise<Product[]> {
        const products: CreateProductDto[] = []; // Store valid products here
    
        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv()) // Parse CSV
                .on('data', (row) => {
                    console.log('Raw CSV Row:', row);
    
                    // Sanitize and map fields
                    const name = row.name?.trim();
                    const description = row.description?.trim();
                    const price = parseFloat(row.price?.trim());
                    const stockLevel = parseInt(row.stockLevel?.trim(), 10);
                    const category = row.category?.trim();
                    const vendorId = parseInt(row.vendorId?.trim(), 10);
    
                    const size = row.size?.trim();
                    const sizeStock = parseInt(row.sizeStock?.trim(), 10);
                    const color = row.color?.trim();
                    const colorStock = parseInt(row.colorStock?.trim(), 10);
    
                    console.log('Sanitized Row:', { name, price, stockLevel, category, vendorId });
    
                    if (!name || price === null || stockLevel === null || !category || vendorId === null) {
                        console.error(`Invalid data for product: ${name || 'Unnamed'}. Skipping.`);
                        return; // Skip invalid row
                    }
                    
    
                    // Map to CreateProductDto
                    const productDto: CreateProductDto = {
                        name,
                        description,
                        price,
                        stockLevel,
                        category,
                        vendorId,
                        variants: this.parseVariants({ size, sizeStock, color, colorStock }),
                    };
    
                    products.push(productDto);
                })
                .on('end', async () => {
                    console.log(`Finished reading CSV. Total valid products: ${products.length}`);
    
                    const savedProducts = [];
                    for (const productDto of products) {
                        try {
                            const product = await this.addProduct(productDto); // Save product to DB
                            savedProducts.push(product);
                        } catch (error) {
                            console.error(`Error saving product ${productDto.name}:`, error);
                        }
                    }
                    console.log(`Successfully uploaded ${savedProducts.length} products.`);
                    resolve(savedProducts);
                })
                .on('error', (error) => {
                    console.error('Error processing CSV:', error);
                    reject(error);
                });
        });
    }
    
    
    

    // Helper method to parse variants from CSV row
    parseVariants(row: any): ProductVariantDto[] {
        const variants: ProductVariantDto[] = [];
    
        // Parse size variant
        if (row.size && !isNaN(parseInt(row.sizeStock?.trim(), 10))) {
            variants.push({
                variantName: 'Size',
                variantValue: row.size.trim(),
                stockLevel: parseInt(row.sizeStock?.trim(), 10),
                price: parseFloat(row.price?.trim()) || 0, // Use product price or default to 0
            });
        }
    
        // Parse color variant
        if (row.color && !isNaN(parseInt(row.colorStock?.trim(), 10))) {
            variants.push({
                variantName: 'Color',
                variantValue: row.color.trim(),
                stockLevel: parseInt(row.colorStock?.trim(), 10),
                price: parseFloat(row.price?.trim()) || 0, // Use product price or default to 0
            });
        }
    
        return variants;
    }
    
    
    


  }