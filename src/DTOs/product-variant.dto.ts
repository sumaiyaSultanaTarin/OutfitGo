import { IsString, IsInt, IsDecimal, IsNotEmpty, IsOptional } from 'class-validator';

export class ProductVariantDto {
    @IsString()
    @IsNotEmpty()
    variantName: string;  // e.g., 'Size', 'Color'

    @IsString()
    @IsNotEmpty()
    variantValue: string;  // e.g., 'M', 'Red'

    @IsInt()
    @IsNotEmpty()
    stockLevel: number;  // Stock for each variant

    @IsDecimal()
    @IsNotEmpty()
    price: number;  // Price for the variant
}
