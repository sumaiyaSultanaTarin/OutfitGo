import { Body, Controller, Post } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { RegisterVendorDto } from 'src/DTOs/register-vendor.dto';
import { LoginVendorDto } from 'src/DTOs/login-vendor.dto';
import { JwtService } from '@nestjs/jwt';


@Controller('auth')
export class VendorController {
    constructor(
        private readonly vendorService: VendorService,
        private readonly jwtService: JwtService,
    ) {}

    @Post('register')
    async register(@Body() registerDto: RegisterVendorDto) {
        const vendor = await this.vendorService.register(registerDto.email, registerDto.password);
        return { message: 'Vendor registered successfully', vendorId: vendor.id };
    }

    @Post('login')
    async login(@Body() loginDto: LoginVendorDto) {
        const vendor = await this.vendorService.validateVendor(loginDto.email, loginDto.password);
        const token = this.jwtService.sign({ id: vendor.id, email: vendor.email });
        return { accessToken: token };
    }
}


