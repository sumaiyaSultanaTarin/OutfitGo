import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterVendorDto {
    @IsEmail({}, { message: 'Email format is not correct' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsString({ message: 'Confirm Password must be a string' })
    @MinLength(6, { message: 'Confirm Password must be at least 6 characters long' })
    confirmPassword: string;

    
}