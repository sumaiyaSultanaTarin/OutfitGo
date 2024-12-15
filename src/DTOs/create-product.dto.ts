import { IsEmail,IsString, IsNotEmpty, IsOptional, IsDecimal, IsInt } from "class-validator";


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
    


}