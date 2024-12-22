import {
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateVendorDto {
  @IsString()
  @IsOptional()
  business_name: string;

  @IsString()
  @IsOptional()
  contact_info: string;

  @IsUrl()
  @IsOptional()
  logo_url: string;

  @IsUrl()
  @IsOptional()
  banner_url: string;

  @IsString()
  @IsOptional()
  return_policy?: string;

  @IsString()
  @IsOptional()
  shipping_terms?: string;

  @IsObject()
  @IsOptional()
  payment_info?: Record<string, any>;

  

}
