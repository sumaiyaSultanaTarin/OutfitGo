import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class LoginVendorDto {
  @IsEmail({}, { message: 'Email format is not correct' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  password: string;

}
