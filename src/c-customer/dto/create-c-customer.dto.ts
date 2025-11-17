import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCCustomerDto {
  @IsString()
  @IsNotEmpty()
  F_Name: string;

  @IsString()
  @IsNotEmpty()
  M_Name: string;

  @IsString()
  @IsNotEmpty()
  L_Name: string;

  @IsEmail()
  @IsNotEmpty()
  UserName: string;

  @IsString()
  @IsNotEmpty()
  Phone_Number: string;
  
  @IsString()
  @IsNotEmpty()
  Password: string;

  @IsString()
  @IsNotEmpty()
  Adress: string;

  @IsString()
  @IsNotEmpty()
  City_Id: string; 

  @IsString()
  @IsNotEmpty()
  Lang_Id: string; 
  
  @IsString()
  Status_Id: string;

  @IsOptional()
  @IsString()
  Image_Base64?: string;
  
  @IsOptional()
  @IsString()
  Created_By?:String
}
