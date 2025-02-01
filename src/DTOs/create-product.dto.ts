import { IsEmail,IsString, IsNotEmpty, IsOptional, IsDecimal, IsInt, IsArray, IsDateString } from "class-validator";
import { ProductVariantDto } from "./product-variant.dto";


export class CreateProductDto{

    @IsString()
    @IsNotEmpty({message: "Not Possible"})
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDecimal()
    @IsNotEmpty()
    price: number;

    @IsInt()
    @IsNotEmpty()
    stockLevel: number;
    
    @IsString()
    @IsOptional()
    category?: string;

    @IsInt()
    @IsNotEmpty()
    vendorId: number;

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