import { BadRequestException, Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { RegisterVendorDto } from 'src/DTOs/register-vendor.dto';
import { LoginVendorDto } from 'src/DTOs/login-vendor.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateVendorDto } from 'src/DTOs/update-vendor.dto';
import { Vendor } from './vendor.entity';


@Controller('auth')
export class VendorController {
    constructor(
        private readonly vendorService: VendorService,
        private readonly jwtService: JwtService,
    ) {}

    @Post('register')
    async register(@Body() registerDto: RegisterVendorDto) {
        if (registerDto.password !== registerDto.confirmPassword) {
            throw new BadRequestException("Passwords do not match");
        }
        const vendor = await this.vendorService.register(registerDto.email, registerDto.password);
        return { message: 'Vendor registered successfully', vendorId: vendor.id };
    }

    @Post('login')
    async login(@Body() loginDto: LoginVendorDto) {
        const vendor = await this.vendorService.validateVendor(loginDto.email, loginDto.password);
        const token = this.jwtService.sign({ id: vendor.id, email: vendor.email }); 
        return { message: 'Login Successful.',accessToken: token };

    }

    @Put(':id')
    async updateProfile(@Param('id') id: number,@Body() updateVendorDto: UpdateVendorDto,): Promise<Vendor> {
        return this.vendorService.updateProfile(id, updateVendorDto);
    }

    @Get(':id')
    async getProfile(@Param('id') id: number): Promise<Vendor> {
      return this.vendorService.getProfile(id);
    }
}


