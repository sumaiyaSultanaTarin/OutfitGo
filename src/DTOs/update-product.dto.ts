import { IsEmail,IsString, IsNotEmpty, IsOptional, IsDecimal, IsInt, IsArray, IsDateString } from "class-validator";
import { ProductVariantDto } from "./product-variant.dto";


export class UpdateProductDto{

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDecimal()
    @IsOptional()
    price?: number;

    @IsInt()
    @IsOptional()
    stockLevel?: number;
    
    @IsString()
    @IsOptional()
    category?: string;

    @IsInt()
    @IsOptional()
    vendorId?: number;

    @IsString()
    @IsOptional()
    imageUrl?: string;
    
    @IsArray()
    @IsOptional()
    variants?: ProductVariantDto[];  

    @IsDecimal()
    @IsOptional()
    discount?: number;


    @IsDateString()
    @IsOptional()
    discountStartDate?: string;

    @IsDateString()
    @IsOptional()
    discountEndDate?: string;

}