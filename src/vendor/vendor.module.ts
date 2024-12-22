import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './vendor.entity';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Profile } from './profile.entity';
import { PaymentInfo } from './payment-info.entity';
import { StorePolicies } from './store-policies.entity';

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([Vendor,Profile, PaymentInfo, StorePolicies])],
    providers: [VendorService],
    controllers: [VendorController],
    exports: [VendorService],
})
export class VendorModule {}
