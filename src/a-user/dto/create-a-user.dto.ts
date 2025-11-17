import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAUserDto {
    @IsString()
    @IsNotEmpty()
    F_Name;

    @IsString()
    @IsNotEmpty()
    M_Name;

    @IsString()
    @IsNotEmpty()
    L_Name;

    @IsEmail()
    @IsNotEmpty()
    UserName;

    @IsString()
    @IsNotEmpty()
    Phone_Number;
    
    @IsString()
    @IsNotEmpty()
    Password;
        
    @IsString()
    Status_Id;
}
