import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from './vendor.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateVendorDto } from 'src/DTOs/update-vendor.dto';
import { Profile } from './profile.entity';
import { PaymentInfo } from './payment-info.entity';
import { StorePolicies } from './store-policies.entity';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(PaymentInfo)
    private readonly paymentInfoRepository: Repository<PaymentInfo>,
    @InjectRepository(StorePolicies)
    private readonly storePoliciesRepository: Repository<StorePolicies>,
  ) {}

  async register(email: string, password: string): Promise<Vendor> {
    //Checking Duplicacy
    const existingVendor = await this.vendorRepository.findOne({
      where: { email },
    });
    if (existingVendor) {
      throw new ConflictException('Vendor already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const vendor = this.vendorRepository.create({
      email,
      password: hashedPassword,
    });
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

  // Update vendor profile
  async updateProfile(
    id: number,
    updateVendorDto: UpdateVendorDto,
  ): Promise<Vendor> {
    const vendor = await this.vendorRepository.findOne({
      where: { id },
      relations: ['profile', 'paymentInfo', 'storePolicies'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with id ${id} not found`);
    }

    // update Profile
    if (
      updateVendorDto.business_name ||
      updateVendorDto.contact_info ||
      updateVendorDto.logo_url ||
      updateVendorDto.banner_url
    ) {
      // Create or update profile as needed
      const profileData = {
        id: vendor.profile?.id,
        business_name: updateVendorDto.business_name,
        contact_info: updateVendorDto.contact_info,
        logo_url: updateVendorDto.logo_url,
        banner_url: updateVendorDto.banner_url,
      };
      const profile = this.profileRepository.create(profileData);
      await this.profileRepository.save(profile);
      vendor.profile = profile;
    }

    // Update Payment Info

    if (updateVendorDto.payment_info) {
      const paymentInfoData = {
        id: vendor.paymentInfo?.id,
        ...updateVendorDto.payment_info,
      };
      const paymentInfo = this.paymentInfoRepository.create(paymentInfoData);
      await this.paymentInfoRepository.save(paymentInfo);
      vendor.paymentInfo = paymentInfo;
    } else if (!vendor.paymentInfo) {
      // If paymentInfo doesn't exist
      const newPaymentInfo = this.paymentInfoRepository.create({});
      await this.paymentInfoRepository.save(newPaymentInfo);
      vendor.paymentInfo = newPaymentInfo;
    }

    // Update Store Policies
    if (updateVendorDto.return_policy || updateVendorDto.shipping_terms) {
      const storePoliciesData = {
        id: vendor.storePolicies?.id,
        return_policy: updateVendorDto.return_policy,
        shipping_terms: updateVendorDto.shipping_terms,
      };
      const storePolicies =
        this.storePoliciesRepository.create(storePoliciesData);
      await this.storePoliciesRepository.save(storePolicies);
      vendor.storePolicies = storePolicies;
    } else if (!vendor.storePolicies) {
      // If storePolicies doesn't exist
      const newStorePolicies = this.storePoliciesRepository.create({});
      await this.storePoliciesRepository.save(newStorePolicies);
      vendor.storePolicies = newStorePolicies;
    }

    await this.vendorRepository.save(vendor);

    return this.vendorRepository.findOne({
      where: { id },
      relations: ['profile', 'paymentInfo', 'storePolicies'],
    });
  }

  // Get vendor profile by ID (with all relations)
  async getProfile(id: number): Promise<Vendor> {
    const vendor = await this.vendorRepository.findOne({
      where: { id },
      relations: ['profile', 'paymentInfo', 'storePolicies'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with id ${id} not found`);
    }

    return vendor;
  }
}
