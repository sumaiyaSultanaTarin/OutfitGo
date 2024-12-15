import { IsInt } from "class-validator";

export class CreateRestockRequestDto{
    @IsInt()
    productId: number;

    @IsInt()
    requestedQuantity: number;

}