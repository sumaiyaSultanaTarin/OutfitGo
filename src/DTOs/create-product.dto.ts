import { IsEmail,IsString, IsNotEmpty, IsOptional, IsDecimal, IsInt, IsArray } from "class-validator";
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
    


}