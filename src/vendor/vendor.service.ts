import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from './vendor.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class VendorService {
    constructor(
        @InjectRepository(Vendor)
        private readonly vendorRepository: Repository<Vendor>,
    ) {}

    async register(email: string, password: string): Promise<Vendor> {
        const existingVendor = await this.vendorRepository.findOne({ where: { email } });
        if (existingVendor) {
            throw new ConflictException('Vendor already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const vendor = this.vendorRepository.create({ email, password: hashedPassword });
        return this.vendorRepository.save(vendor);
    }

    async validateVendor(email: string, password: string): Promise<Vendor> {
        const vendor = await this.vendorRepository.findOne({ where: { email } });
        if (!vendor) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, vendor.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return vendor;
    }
}
