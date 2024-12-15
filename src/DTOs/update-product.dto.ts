import { IsEmail,IsString, IsNotEmpty, IsOptional, IsDecimal, IsInt } from "class-validator";


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
    


}