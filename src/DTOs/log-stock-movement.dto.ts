import { IsIn, IsInt, IsOptional, IsString } from "class-validator";

export class LogStockMovementDto{
    @IsInt()
    productId: number;

    @IsString()
    @IsIn(['inbound', 'outbound'])
    type: 'inbound' | 'outbound';

    @IsInt()
    quantity: number;

    @IsString()
    @IsOptional()
    notes?: string;
}