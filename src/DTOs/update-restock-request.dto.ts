import { IsIn, IsString } from "class-validator";

export class UpdateRestockRequestDto{
    @IsString()
    @IsIn(['Pending', 'Approved', 'Rejected'])
    status: 'Pending' | 'Approved' | 'Rejected';
}