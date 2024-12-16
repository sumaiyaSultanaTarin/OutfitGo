import { IsIn, IsString } from "class-validator";

export class UpdateOrderStatusDto{

    @IsString()
    @IsIn(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancel'])
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancel';
}