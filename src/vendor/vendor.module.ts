import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './vendor.entity';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([Vendor])],
    providers: [VendorService],
    controllers: [VendorController],
    exports: [VendorService],
})
export class VendorModule {}
