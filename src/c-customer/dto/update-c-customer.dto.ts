import { PartialType } from '@nestjs/mapped-types';
import { CreateCCustomerDto } from './create-c-customer.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCCustomerDto extends PartialType(CreateCCustomerDto) {
      @IsString()
      @IsOptional()
      F_Name: string;
    
      @IsString()
      @IsOptional()
      M_Name: string;
    
      @IsString()
      @IsOptional()
      L_Name: string;
    
      @IsString()
      @IsOptional()
      Phone_Number: string;
      
      @IsString()
      @IsOptional()
      Password: string;
    
      @IsString()
      @IsOptional()
      Adress: string;
    
      @IsString()
      @IsOptional()
      City_Id: string; 
    
      @IsString()
      @IsOptional()
      Lang_Id: string; 
      
      @IsString()
      Status_Id: string;
    
      @IsOptional()
      @IsString()
      Image_Base64?: string; 
}
