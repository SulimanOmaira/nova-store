import { IsEmail, IsNotEmpty, IsOptional, IsString , MaxLength} from "class-validator";

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

  @IsOptional()
  @IsString()
  @MaxLength(255)
  StoreName?: string;
}
