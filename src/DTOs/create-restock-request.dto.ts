import { IsInt, Min } from "class-validator";

export class CreateRestockRequestDto{
    @IsInt({ message: 'Product ID must be a valid number.' })
    productId: number;

    @IsInt()
    @Min(1, { message: 'Quantity must be at least 1.' })
    requestedQuantity: number;

}