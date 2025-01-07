import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockMovement } from '../stock-movement.entity';
import { Repository } from 'typeorm';
import { RestockRequest } from '../restock-request.entity';
import { Product } from 'src/Product/product.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Parser } from 'json2csv'; 
import * as PDFDocument from 'pdfkit'; 
import * as fs from 'fs';
import * as csv from 'csv-parser';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(StockMovement)
    private readonly stockMovementRepository: Repository<StockMovement>,
    @InjectRepository(RestockRequest)
    private readonly restockRequestRepository: Repository<RestockRequest>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getInventoryMetrics() {
    return {
      totalProducts: await this.stockMovementRepository.count(),
      totalStockValue: await this.stockMovementRepository.query(`
            SELECT SUM(p."price" * sm."quantity") AS "totalStockValue"
            FROM "public"."stock_movements" sm
            JOIN "public"."products" p ON p."id" = sm."productId"
            WHERE sm."type" = 'inbound';

            `),
      lowStockItems: await this.stockMovementRepository.query(`
            SELECT COUNT(*) AS "lowStockItems"
            FROM "public"."products"
            WHERE "stockLevel" < 10
            `),
    };
  }

  async logStockMovement(
    productId: number,
    type: 'inbound' | 'outbound',
    quantity: number,
    notes?: string,
  ) {
    const stockMovement = this.stockMovementRepository.create({
      product: { id: productId },
      type,
      quantity,
      notes,
    });
    await this.stockMovementRepository.save(stockMovement);

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new Error('Product not found');
    }
    product.stockLevel += type === 'inbound' ? quantity : -quantity;

    await this.productRepository.save(product);

    const LOW_STOCK_THRESHOLD = 10; 

    if (product.stockLevel < LOW_STOCK_THRESHOLD) {
        this.notificationsService.notifyLowStock(productId, product.stockLevel);
    }

    return stockMovement;
  }

  //To create New Restock Request
  async createRestockRequest(productId: number, requestedQuantity: number) {
    const request = this.restockRequestRepository.create({
      product: { id: productId },
      requestedQuantity,
    });
    return this.restockRequestRepository.save(request);
  }

  //To retrieve all the restock requests
  async getRestockRequests() {
    return this.restockRequestRepository.find({ relations: ['product'] });
  }

  //To  update the status of a restock request
  async updateRestockRequest(
    id: number,
    status: 'Pending' | 'Approved' | 'Rejected',
  ) {
    await this.restockRequestRepository.update(id, { status });
    return this.restockRequestRepository.findOne({
      where: { id },
      relations: ['product'],
    });
  }

  //To Exprot InventorY data as CSV
  
  async exportInventoryAsCSV(): Promise<string> {
    const products = await this.productRepository.find();
    const fields = ['id', 'name', 'price', 'stockLevel', 'category'];
    const parser = new Parser({ fields });
    const csv = parser.parse(products);

    const filePath = './inventory-report.csv';
    fs.writeFileSync(filePath, csv);
    return filePath;
  }

  //To Export Inventory data as PDF
    async exportInventoryAsPDF(): Promise<string> {
        const products = await this.productRepository.find();
        const filePath = './inventory-report.pdf';
        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);   
    
        doc.fontSize(25).text('Inventory Report', { align: 'center' });
        doc.moveDown();
        products.forEach((product) => {
            doc
              .fontSize(12)
              .text(
                `ID: ${product.id}, Name: ${product.name}, Price: $${product.price}, Stock: ${product.stockLevel}, Category: ${product.category}`,
              )
              .moveDown();
          });
      
    
        doc.end();
        return new Promise((resolve, reject) => {
            writeStream.on('finish', () => resolve(filePath));
            writeStream.on('error', (err) => reject(err));
          });
    }

    

      


}
